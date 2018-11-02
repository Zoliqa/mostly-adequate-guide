import $ from 'jquery';
import { curry, prop, identity } from 'ramda';
import Task from 'data.task';

const getJSON = curry((url, params) => new Task((reject, result) => {
    $.getJSON(url, params, result).fail(reject);
}));

const host = 'api.flickr.com';
const path = '/services/feeds/photos_public.gne';
const query = t => `?tags=${t}&format=json&jsoncallback=?`;
const url = t => `https://${host}${path}${query(t)}`;

getJSON(url('cat'), null).map(prop('items')).fork(identity, console.log);

Task.of(3).map(three => three + 1).fork(identity, console.log);



