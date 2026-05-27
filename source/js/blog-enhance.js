(function() {
  var CHECK_INTERVAL_MS = 60 * 1000;

  function createUpdateBanner(onReload) {
    var banner = document.createElement('div');
    banner.className = 'site-update-banner';
    banner.hidden = true;
    banner.innerHTML = [
      '<span class="site-update-banner__text">页面有更新。</span>',
      '<button class="site-update-banner__button" type="button">点击刷新</button>'
    ].join('');

    var button = banner.querySelector('.site-update-banner__button');
    button.addEventListener('click', function() {
      onReload();
    });

    document.body.appendChild(banner);
    return banner;
  }

  function initVersionWatcher() {
    var versionPath = window.__BLOG_VERSION_PATH__;
    if (!versionPath || !window.fetch) return;

    var currentVersion = null;
    var banner = null;
    var timer = null;
    var visible = false;

    var showBanner = function(nextVersion) {
      if (visible) return;
      visible = true;
      banner = banner || createUpdateBanner(function() {
        var url = new URL(window.location.href);
        url.searchParams.set('_reload', Date.now().toString());
        window.location.replace(url.toString());
      });
      banner.hidden = false;
      banner.dataset.version = nextVersion;
    };

    var checkVersion = function() {
      var requestUrl = versionPath + '?t=' + Date.now();
      return window.fetch(requestUrl, { cache: 'no-store' })
        .then(function(response) {
          if (!response.ok) throw new Error('version fetch failed');
          return response.json();
        })
        .then(function(payload) {
          if (!payload || !payload.version) return;

          if (currentVersion === null) {
            currentVersion = payload.version;
            return;
          }

          if (payload.version !== currentVersion) {
            showBanner(payload.version);
          }
        })
        .catch(function() {
          return null;
        });
    };

    checkVersion().then(function() {
      timer = window.setInterval(checkVersion, CHECK_INTERVAL_MS);
    });

    window.addEventListener('beforeunload', function() {
      if (timer) window.clearInterval(timer);
    });
  }

  function initGiscus() {
    var container = document.querySelector('.giscus');
    if (!container || typeof window.__BLOG_GISCUS__ === 'undefined') return;

    var config = window.__BLOG_GISCUS__;
    if (!config.repo || !config.repoId || !config.category) return;

    if (!config.categoryId) {
      container.innerHTML = '<div class="docs-empty">已预留评论区，待仓库开启 Discussions 并补充 giscus 分类 ID 后即可启用。</div>';
      return;
    }

    if (container.dataset.loaded === 'true') return;

    var script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', config.repo);
    script.setAttribute('data-repo-id', config.repoId);
    script.setAttribute('data-category', config.category);
    script.setAttribute('data-category-id', config.categoryId);
    script.setAttribute('data-mapping', config.mapping || 'pathname');
    script.setAttribute('data-strict', config.strict || '0');
    script.setAttribute('data-reactions-enabled', config.reactionsEnabled || '1');
    script.setAttribute('data-emit-metadata', config.emitMetadata || '0');
    script.setAttribute('data-input-position', config.inputPosition || 'top');
    script.setAttribute('data-theme', config.theme || 'preferred_color_scheme');
    script.setAttribute('data-lang', config.lang || 'zh-CN');
    script.setAttribute('data-loading', config.loading || 'lazy');
    container.appendChild(script);
    container.dataset.loaded = 'true';
  }

  function initDocsTreeState() {
    var treeItems = document.querySelectorAll('.docs-tree-dir');
    if (!treeItems.length) return;

    treeItems.forEach(function(item) {
      var label = item.querySelector('.docs-tree-dir-label');
      var details = item.querySelector('details');
      if (!label || !details) return;

      var key = label.textContent.trim();
      var saved = window.localStorage.getItem('docs-tree:' + key);
      if (saved === 'open') details.open = true;
      if (saved === 'closed') details.open = false;

      details.addEventListener('toggle', function() {
        window.localStorage.setItem('docs-tree:' + key, details.open ? 'open' : 'closed');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initVersionWatcher();
    initGiscus();
    initDocsTreeState();
  });
})();
