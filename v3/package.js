// 头部资源与组件包 V3
// 版本:240623 Created By PYLXU
const assetsURL = "https://assets.3r60.top/v3";
const currentVersion = "240813";

// 资源引入清单
document.writeln(`
<script src='https://assets.3r60.top/Jquery/jquery-3.5.1.js'></script>
<script src='https://assets.3r60.top/v3/js/main.js'></script>
`);

const resources = {
  javaScripts: [
    '/moudle/m_dialog.js',
    '/moudle/m_topbar.js',
	'/moudle/m_lead.js',
	'/moudle/m_footer.js',
  ],
  styleSheets: [
    `/css/basic.css`,
    `/css/main.css`,
    `/css/topbar.css`,
    `/css/footer.css`,
    `/css/button.css`,
    `/css/dialog.css`,
    `/css/card.css`,
    `/css/list.css`,
    `/css/form.css`,
     `/css/tag.css`,
    `https://assets.3r60.top/icons/bootstrap-icons.css`,
  ],
  customStyles: [],
};

const metaTags = [
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
];

// 资源引入函数
function appendResources(type, urls, assetsBaseURL = '') {
  urls.forEach(url => {
    const isExternalURL = url.startsWith('http://') || url.startsWith('https://');
    let element;
    if (type === 'javaScripts') {
      element = document.createElement('script');
      element.src = isExternalURL ? url : assetsBaseURL + url;
      document.head.appendChild(element);
    } else if (type === 'styleSheets') {
      element = document.createElement('link');
      element.href = isExternalURL ? url : assetsBaseURL + url;
      element.rel = 'stylesheet';
      document.head.appendChild(element);
    }
  });
}
function appendMetaTags(tags) {
  tags.forEach(tag => {
    let meta = document.createElement('meta');
    for (let attr in tag) {
      meta.setAttribute(attr, tag[attr]);
    }
    document.head.appendChild(meta);
  });
}
// 检查版本更新
function checkForUpdates() {
  const versionInfoURL = `https://api.3r60.top/v2/assets/`;
  fetch(versionInfoURL)
    .then(response => response.json())
    .then(data => {
      const remoteVersion = data.version;
      if (remoteVersion !== currentVersion) {
        console.log('[RWUIv3] 发现新版本！');
        setTimeout(() => {
          createMessage('<b>资源更新提示</b><br>资源文件已更新,请强制刷新（Ctrl+F5）此页面以更新','danger',3000,false);
        }, 500);
      } else {
        console.log('[RWUIv3] 界面资源已是最新版本');
      }
    })
    .catch(error => {
      console.error('[RWUIv3] 版本信息获取失败:', error);
    });
}
    appendResources('styleSheets', resources.styleSheets, assetsURL);
// 当DOM加载完成时执行版本检查
window.onload = function(){
  appendResources('javaScripts', resources.javaScripts, assetsURL);
  resources.customStyles.forEach(style => document.writeln(style));
  document.body.insertAdjacentHTML('beforeend', `<script src="${assetsURL}/package-end.js"></script>`);
  appendMetaTags(metaTags);
  checkForUpdates();
};

console.log(`[RWUIv3] 应用样式成功`);