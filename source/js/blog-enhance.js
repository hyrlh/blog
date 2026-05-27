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
    if (typeof LocalSearch === 'undefined') return;

    var pageSearch = document.querySelector('[data-local-search-page]');
    var docsSearchInput = document.querySelector('[data-docs-search-input]');
    var docsSearchResults = document.querySelector('[data-docs-search-results]');
    var pageSearchInput = document.querySelector('[data-local-search-input]');
    var pageSearchResults = document.querySelector('[data-local-search-results]');

    if (!pageSearch && !docsSearchInput) return;

    var input = pageSearch ? pageSearchInput : docsSearchInput;
    var results = pageSearch ? pageSearchResults : docsSearchResults;
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

  function initSearchModal() {
    var modal = document.getElementById('docs-search-modal');
    var trigger = document.querySelector('.nav-search-btn');
    var closeBtn = document.querySelector('.docs-search-close');
    var backdrop = document.querySelector('.docs-search-backdrop');
    var input = document.querySelector('[data-docs-search-input]');
    if (!modal || !trigger || !closeBtn || !backdrop || !input) return;

    var openModal = function() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      window.setTimeout(function() {
        input.focus();
      }, 30);
    };

    var closeModal = function() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    };

    trigger.addEventListener('click', function(event) {
      event.preventDefault();
      openModal();
    });

    trigger.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }

      var activeTag = document.activeElement && document.activeElement.tagName;
      var isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

      if (!isTyping && event.key === '/') {
        event.preventDefault();
        openModal();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openModal();
      }
    });
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
    initSearchModal();
  });
})();
