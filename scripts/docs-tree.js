const path = require('path');
const ORDER_PREFIX_RE = /^\d+[-_.\s]+/;

function stripOrderPrefix(name) {
  const normalized = (name || '').trim();
  const displayName = normalized.replace(ORDER_PREFIX_RE, '').trim();
  return displayName || normalized;
}

function createDirNode(name, fullPath) {
  return {
    type: 'dir',
    name,
    displayName: stripOrderPrefix(name),
    fullPath,
    dirs: [],
    dirMap: new Map(),
    posts: []
  };
}

function splitSourcePath(post) {
  const sourcePath = post.source || '';
  const normalized = sourcePath.replace(/\\/g, '/');
  const withoutRoot = normalized.startsWith('_posts/') ? normalized.slice('_posts/'.length) : normalized;
  const parts = withoutRoot.split('/').filter(Boolean);
  const filename = parts.pop() || '';
  const basename = filename.replace(path.extname(filename), '');
  return {
    dirs: parts,
    filename,
    basename
  };
}

function getOrCreateDir(parent, dirName) {
  if (parent.dirMap.has(dirName)) {
    return parent.dirMap.get(dirName);
  }

  const fullPath = parent.fullPath ? `${parent.fullPath}/${dirName}` : dirName;
  const child = createDirNode(dirName, fullPath);
  parent.dirMap.set(dirName, child);
  parent.dirs.push(child);
  return child;
}

function finalizeNode(node) {
  node.dirs.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  node.posts.sort((a, b) => a.basename.localeCompare(b.basename, 'zh-CN'));
  node.dirs.forEach(finalizeNode);
  delete node.dirMap;
  return node;
}

hexo.extend.helper.register('build_docs_tree', function(posts) {
  const root = createDirNode('', '');
  const list = posts
    .filter(post => post && post.source && !post.hidden && post.layout === 'post')
    .sort('source');

  list.each(post => {
    const { dirs, filename, basename } = splitSourcePath(post);
    let current = root;

    dirs.forEach(dirName => {
      current = getOrCreateDir(current, dirName);
    });

    current.posts.push({
      type: 'post',
      title: post.title || stripOrderPrefix(basename),
      path: post.path,
      source: post.source,
      filename,
      basename,
      date: post.date
    });
  });

  return finalizeNode(root);
});
