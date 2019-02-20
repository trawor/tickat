/* eslint-disable no-underscore-dangle */
const Octokit = require('@octokit/rest');
const pkginfo = require('./package.json');

const uidBodyReg = /- uid:(.+)\n----\n(.+)/;

class Tickat {
  constructor(repo, token, hookUrl, baseUrl) {
    // TODO: detect repo url or just a name
    this.repo = repo;
    this.token = token;
    this.hookUrl = hookUrl;

    const clientOpt = {
      userAgent: `${pkginfo.name}/${pkginfo.version}`,
      auth: `token ${token}`,
      baseUrl: baseUrl || 'https://api.github.com',
    };
    if (process.env.NODE_ENV === 'development') {
      clientOpt.log = console;
    }
    this._client = new Octokit(clientOpt);
  }

  async create(uid, title, body) {
    const {
      status,
      headers,
      data,
    } = await this._client.request(`POST /repos/${this.repo}/issues`, {
      data: {
        title,
        body: `- uid:${uid}\n----\n${body}`,
      },
    });
    if (status >= 400) {
      const err = new Error('TickatError');
      err.code = status;
      err.data = data;
      err.headers = headers;
      throw (err);
    }

    return data;
  }

  async close(tNumber) {
    const {
      status,
      headers,
      data,
    } = await this._client.request(`PATCH /repos/${this.repo}/issues/${tNumber}`, {
      data: {
        state: 'closed',
      },
    });
    if (status >= 400) {
      const err = new Error('TickatError');
      err.code = status;
      err.data = data;
      err.headers = headers;
      throw (err);
    }

    return data;
  }

  async getTickets(uid, state) {
    let q = encodeURIComponent(`repo:${this.repo}`);
    if (uid) {
      const p1 = encodeURIComponent(`uid:${uid}`);
      const p2 = encodeURIComponent('in:body');
      q += `+${p1}+${p2}`;
    }
    if (state === 'open' || state === 'close') {
      const p1 = encodeURIComponent(`is:${state}`);
      q += `+${p1}`;
    }

    const {
      status,
      headers,
      data,
    } = await this._client.request(`GET /search/issues?q=${q}`);
    if (status >= 400) {
      const err = new Error('TickatError');
      err.code = status;
      err.data = data;
      err.headers = headers;
      throw (err);
    }
    const {
      items,
    } = data;

    for (let i = 0; i < items.length; i++) {
      const match = uidBodyReg.exec(items[i].body);
      if (match != null) {
        items[i].tickat = {
          uid: match[1],
        };
        // eslint-disable-next-line prefer-destructuring
        items[i].body = match[2];
      } else {
        // TODO: what wrong
      }
    }

    return data;
  }
}

module.exports = Tickat;
