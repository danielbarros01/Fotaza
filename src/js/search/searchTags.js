import { addTags } from '../publication/tags.js'

/* TAGS */
const $tag = document.querySelector("#tag")
const $tags = document.querySelector("#tags")
const $spanErrTag = document.getElementById('errTag')
const tags = []

addTags(tags, $tag, $tags, $spanErrTag, undefined, true);
/*-- TAGS --*/


