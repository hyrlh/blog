(function() {
  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initGiscus() {
    var container = document.querySelector('.giscus');
    if (!container || typeof window.__BLOG_GISCUS__ === 'undefined') return;

    var config = window.__BLOG_GISCUS__;
    if (!config.repo || !config.repoId || !config.category) return;

    if (!config.categoryId) {
      container.innerHTML = '<div class="search-empty">已预留评论区，待仓库开启 Discussions 并补充 giscus 分类 ID 后即可启用。</div>';
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

  function initLocalSearch() {
    var pageSearch = document.querySelector('[data-local-search-page]');
    if (!pageSearch || typeof LocalSearch === 'undefined') return;

    var input = document.querySelector('[data-local-search-input]');
    var results = document.querySelector('[data-local-search-results]');
    if (!input || !results) return;

    var searchEngine = new LocalSearch({
      path: window.__BLOG_SEARCH_PATH__ || '/search.json',
      unescape: true
    });

    var renderEmpty = function(message) {
      results.innerHTML = '<p class="search-empty">' + escapeHtml(message) + '</p>';
    };

    var renderResults = function(items, keyword) {
      if (!items.length) {
        renderEmpty('没有找到与 “' + keyword + '” 相关的内容。');
        return;
      }

      results.innerHTML = items.map(function(item) {
        var excerpt = item.content || '';
        if (excerpt.length > 160) excerpt = excerpt.slice(0, 160) + '...';
        return [
          '<article class="search-hit">',
          '<h3 class="search-hit-title"><a href="' + item.url + '">' + escapeHtml(item.title || '未命名文章') + '</a></h3>',
          '<p class="search-hit-excerpt">' + escapeHtml(excerpt) + '</p>',
          '</article>'
        ].join('');
      }).join('');
    };

    input.addEventListener('input', function(event) {
      var keyword = event.target.value.trim();
      if (!keyword) {
        renderEmpty('输入关键词后开始搜索。');
        return;
      }

      searchEngine.search(keyword).then(function(items) {
        renderResults(items, keyword);
      }).catch(function() {
        renderEmpty('搜索索引加载失败，请稍后重试。');
      });
    });

    renderEmpty('输入关键词后开始搜索。');
  }

  function initDocsTreeState() {
    var treeItems = document.querySelectorAll('.docs-tree-category');
    if (!treeItems.length) return;

    treeItems.forEach(function(item) {
      var key = item.getAttribute('data-category-key');
      var details = item.querySelector('details');
      if (!key || !details) return;

      var saved = window.localStorage.getItem('docs-tree:' + key);
      if (saved === 'open') details.open = true;
      if (saved === 'closed') details.open = false;

      details.addEventListener('toggle', function() {
        window.localStorage.setItem('docs-tree:' + key, details.open ? 'open' : 'closed');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initGiscus();
    initLocalSearch();
    initDocsTreeState();
  });
})();
