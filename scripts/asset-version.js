const assetVersion = process.env.GITHUB_SHA
  ? process.env.GITHUB_SHA.slice(0, 8)
  : String(Date.now());

function normalizeAnalyticsId(value) {
  const id = String(value || '').trim();
  return id && !/^\$\{[A-Z0-9_]+\}$/.test(id) ? id : '';
}

hexo.extend.helper.register('versioned_asset', function(path) {
  const resolved = this.url_for(path);
  const separator = resolved.includes('?') ? '&' : '?';
  return `${resolved}${separator}v=${assetVersion}`;
});

hexo.extend.helper.register('google_analytics_id', function() {
  return normalizeAnalyticsId(process.env.GOOGLE_ANALYTICS_ID || this.theme.google_analytics);
});

hexo.extend.helper.register('site_version', function() {
  return assetVersion;
});

hexo.extend.generator.register('version_manifest', function() {
  return {
    path: 'version.json',
    data: JSON.stringify({
      version: assetVersion,
      generatedAt: new Date().toISOString()
    }, null, 2)
  };
});
