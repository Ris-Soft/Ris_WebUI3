function createTopBar(topbarElement) {
    var title = topbarElement.data('title') || defaultTitle,
        navItems =  defaultNavItems || JSON.parse(topbarElement.data('navItems')),
        navRightItems = defaultNavRightItems || JSON.parse(topbarElement.data('navRightItems'));

    navRightItems.push({
        text: '<i class="bi bi-gear-fill"></i>',
        href: `javascript:createDialog('set', 'primary', '站点偏好', '设置站点默认行为');`
    });

    if ($(window).width() <= 768) {
        navRightItems.push({
            text: '<span class="device_OnlyPhone"><i class="bi bi-list"></i></span>',
            href: `javascript:expandNewTopBar();`
        });
    }

    // 创建标题部分
    $('<h1/>', {
        'class': 'navLeft',
        html: $('<a/>', {
            href: window.location.origin,
            text: title,
            click: function(e) {
                    e.preventDefault();
                    document.title = webTitle;
                    history.pushState('', '', window.location.origin+"/");
                    setActiveLinkInTopbar($('topbar'));
                    fetchAndReplaceContent(window.location.origin, 'main', 'main',()=>{
                        reloadScript(assetsURL + "/moudle/m_lead.js");
                        reloadScript(assetsURL + "/moudle/m_footer.js");
                        if($("lead").length > 0) {
                            $("main").addClass('flex pb-0');
                        } else {
                            $("main").removeClass('flex pb-0');
                        }
                    });
                }
        })
    }).appendTo(topbarElement);

    // 创建导航左侧部分
    var navLeft = $('<ul/>', {'class': 'navCenter'}).appendTo(topbarElement);
    navItems.forEach(function(item) {
        if (window.location.href.indexOf(item.href) !== -1) {
             document.title = item.text + ' | ' + webTitle;
        }
        $('<li/>', {
            html: $('<a/>', {
                href: item.href,
                html: item.text,
                click: function(e) {
                    e.preventDefault();
                    document.title = item.text + ' | ' + webTitle;
                    history.pushState('', '', item.href+"/");
                    setActiveLinkInTopbar($('topbar'));
                    fetchAndReplaceContent(item.href, 'main', 'main',()=>{
                        reloadScript(assetsURL + "/moudle/m_lead.js");
                        reloadScript(assetsURL + "/moudle/m_footer.js");
                        if($("lead").length > 0) {
                            $("main").addClass('flex pb-0');
                        } else {
                            $("main").removeClass('flex pb-0');
                        }
                    });
                }
            })
        }).appendTo(navLeft);
    });

    // 创建导航右侧部分
    var navRight = $('<ul/>', {'class': 'navRight'}).appendTo(topbarElement);
    navRightItems.forEach(function(item) {
        $('<li/>', {
            html: $('<a/>', {
                href: item.href,
                html: item.text
            })
        }).appendTo(navRight);
    });
    setActiveLinkInTopbar($('topbar'));
}

var showMiniTopbar = false;

function setActiveLinkInTopbar($topbar) {
    var currentUrl = window.location.href;
    $topbar.find('li').each(function() {
        var $this = $(this);
        var href = new URL($this.find('a').attr('href'), currentUrl).toString();
        if (window.location.href.indexOf(href) !== -1) {
            $this.addClass('active');
            document.title = $this.find('a').text() + ' | ' + webTitle;
        } else {
            $this.removeClass('active');
        }
    });
}



function expandNewTopBar() {
    if (showMiniTopbar) {
        $('#miniNavBar').remove();
        showMiniTopbar = false;
    } else {
        var navItems =  defaultNavItems || JSON.parse(topbarElement.data('navItems'));
        var miniNavBar = $('<div/>', {
            id: 'miniNavBar',
            'class': 'miniNavBar'
        }).append($('<ul/>', {'class': 'list'}).append(
            navItems.map(function(item) {
                return $('<li/>').append($('<a/>', {
                    href: item.href,
                    text: item.text,
                    class: (window.location.href.includes(item.href)) ? 'active' : ''
                }));
            })
        )).appendTo($('body'));
        showMiniTopbar = true;
    }
}

$('document').ready(function() {
    var topbarElement = $('topbar');
    if (topbarElement.length && topbarElement.data('noReplace') !== 'true') {
        topbarElement.empty();
        createTopBar(topbarElement);
    } else {
        console.log('未找到<topbar>元素，顶栏创建操作被忽略。');
    }
});