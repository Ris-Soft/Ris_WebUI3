function createFooter(footerElement) {
    // 设置默认参数
    let footerLinks = defaultFooterLinks;
    if (footerElement.data('links')) {
        footerLinks = JSON.parse(footerElement.data('links'));
    }

    let copyrightInfo = defaultCopyright;
    if (footerElement.data('copyright')) {
        copyrightInfo = footerElement.data('copyright');
    }

    // 清空现有内容
    footerElement.empty();

    // 创建链接列表
    const linksList = $('<ul>');
    footerLinks.forEach(link => {
        $('<li>').append($('<a>', {
            href: link.href || '#',
            text: link.text || '链接'
        })).appendTo(linksList);
    });

    // 创建版权信息段落
    const copyrightPara = $('<p>', {
        text: copyrightInfo
    });

    // 将链接列表和版权信息添加到页脚元素
    footerElement.append(linksList, copyrightPara);

    return footerElement;
}

// 检测并处理<footer>元素
var $footerElement = $('footer');
if ($footerElement.length) {
    createFooter($footerElement);
} else {
    console.log('未找到<footer>元素，页脚创建操作被忽略。');
}