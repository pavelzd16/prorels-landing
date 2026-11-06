import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_METRIKA_ID, isCatalogHref, resolveMetrikaId } from '../src/lib/metrika.ts';

test('the landing counter is on only in production builds unless overridden', () => {
  assert.equal(DEFAULT_METRIKA_ID, 114100270);
  assert.equal(resolveMetrikaId(undefined, true), 114100270);
  assert.equal(resolveMetrikaId('', false), undefined);
  assert.equal(resolveMetrikaId(' 99999999 ', false), 99999999);
  assert.equal(resolveMetrikaId('off', true), undefined);
});
test('only links to the prorelsa.ru catalog count as the catalog goal', () => {
  for (const href of ['https://prorelsa.ru/catalog', 'https://prorelsa.ru/catalog?category=rels', 'https://www.prorelsa.ru/about', 'http://prorelsa.ru/', 'https://prorelsa.ru/privacy']) assert.equal(isCatalogHref(href), true, href);
  for (const href of ['/', '/blog', '#contacts', 'tel:+79656155059', 'mailto:zakaz@prorelsa.ru', 'https://prorels.com/blog', 'https://prorelsa.ru.example.com/', 'https://notprorelsa.ru/', '', null, undefined]) assert.equal(isCatalogHref(href), false, String(href));
});
