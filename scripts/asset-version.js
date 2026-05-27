const assetVersion = process.env.GITHUB_SHA
  ? process.env.GITHUB_SHA.slice(0, 8)
  : String(Date.now());

hexo.extend.helper.register('versioned_asset', function(path) {
  const resolved = this.url_for(path);
  const separator = resolved.includes('?') ? '&' : '?';
  return `${resolved}${separator}v=${assetVersion}`;
});
