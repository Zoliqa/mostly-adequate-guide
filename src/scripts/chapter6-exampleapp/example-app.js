import { compose, curry, prop, map } from 'ramda';
import $ from 'jquery';
import { trace } from '../util';

const Impure = {
    getJSON: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((sel, html) => $(sel).html(html))
};

const host = 'api.flickr.com';
const path = '/services/feeds/photos_public.gne';
const query = t => `?tags=${t}&format=json&jsoncallback=?`;
const url = t => `https://${host}${path}${query(t)}`;

// const app = compose(Impure.getJSON(trace('response')), trace('url'), url);

const img = src => $('<img />', { src });

const mediaUrl = compose(prop('m'), prop('media'));
const mediaToImg = compose(img, mediaUrl);
const images = compose(map(mediaToImg), prop('items'));

const render = compose(Impure.setHtml('#main'), images);
const app = compose(Impure.getJSON(compose(render, trace('response'))), trace('url'), url);

app('cat'); 




