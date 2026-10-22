import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPageTitle } from '../src/lib/data/pageTitle';
import { defaultHomepageConfig } from '../src/lib/data/homepage';
import {
  defaultSiteSettings,
  normalizePublicSiteSettings,
} from '../src/lib/server/siteSettings';
import { validateSiteSettingsForm } from '../src/lib/server/validation/siteSettings';
import { validateRevisionSnapshot } from '../src/lib/server/validation/revisionSnapshots';

test('public page titles use the configured identity once', () => {
  assert.equal(
    formatPageTitle('Projects', 'Sample Owner'),
    'Projects — Sample Owner',
  );
  assert.equal(
    formatPageTitle('Example Project — Sample Owner', 'Sample Owner'),
    'Example Project — Sample Owner',
  );
  assert.equal(
    formatPageTitle(' Notes ', ' Sample Owner '),
    'Notes — Sample Owner',
  );
});

test('page title formatting safely handles missing values', () => {
  assert.equal(formatPageTitle('Projects', '  '), 'Projects');
  assert.equal(formatPageTitle('  ', 'Sample Owner'), 'Sample Owner');
});

test('missing or whitespace-only public settings use established defaults', () => {
  assert.deepEqual(normalizePublicSiteSettings(undefined), defaultSiteSettings);
  assert.deepEqual(
    normalizePublicSiteSettings({
      siteName: '  ',
      name: '\n',
      seoDescription: '',
      github: ' ',
      email: null,
    }),
    defaultSiteSettings,
  );
});

test('valid settings retain supported identity characters and trim whitespace', () => {
  const normalized = normalizePublicSiteSettings({
    ...defaultSiteSettings,
    siteName: '  A & B Studio  ',
    name: "  Zoë O'Neil  ",
  });

  assert.equal(normalized.siteName, 'A & B Studio');
  assert.equal(normalized.name, "Zoë O'Neil");
});

test('a site can keep public email unpublished without blocking settings or revisions', () => {
  const form = new URLSearchParams(Object.entries(defaultSiteSettings));
  assert.equal(validateSiteSettingsForm(form).success, true);
  assert.equal(
    validateRevisionSnapshot(
      'site_settings',
      { id: 'primary', ...defaultSiteSettings },
      'primary',
    ).success,
    true,
  );
  form.set('email', 'invalid-address');
  assert.equal(validateSiteSettingsForm(form).success, false);
});

test('a homepage with no portrait remains a valid restorable snapshot', () => {
  assert.equal(
    defaultHomepageConfig.portrait,
    '/images/gamon-elio-portrait.jpeg',
  );
  assert.equal(
    validateRevisionSnapshot(
      'homepage_settings',
      { id: 'primary', ...defaultHomepageConfig, portrait: '' },
      'primary',
    ).success,
    true,
  );
});
