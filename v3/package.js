// 头部资源与组件包 V3
// 版本:240623 Created By PYLXU
const assetsURL = "https://assets.3r60.top/v3";

// 资源引入清单
document.writeln(`
<script src='https://assets.3r60.top/Jquery/jquery-3.5.1.js'></script>
<script src='https://assets.3r60.top/Jquery/jquery.pjax.js'></script>
`);
const resources = {
  javaScripts: ['/js/main.js','/moudle/moudleContents.js'],
  styleSheets: [`/css/main.css`,`/css/button.css`,`/css/basic.css`,
    `https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.11.0/font/bootstrap-icons.css`],
  customStyles: [
  ]
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

appendMetaTags(metaTags);
['javaScripts', 'styleSheets'].forEach(type => 
  appendResources(type, resources[type], assetsURL)
);

// 自定义样式写入
resources.customStyles.forEach(style => document.writeln(style));

// 通知尾部资源包
window.addEventListener('DOMContentLoaded', function() {
    document.body.insertAdjacentHTML('beforeend', `<script src="${assetsURL}/package-end.js"></script>`);
});

console.log(`[RWUIv3]应用样式成功`);