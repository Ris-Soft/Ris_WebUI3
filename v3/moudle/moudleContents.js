// 模块化组件引入 V3
// 版本:240623 Created By PYLXU

const m_resources = {
  javaScripts: [
    '/moudle/m_dialog.js',
	'/moudle/m_topbar.js',
	'/moudle/m_lead.js',
	'/moudle/m_footer.js',
	],
};
// 应用资源
['javaScripts'].forEach(type => 
  appendResources(type, m_resources[type], assetsURL)
);