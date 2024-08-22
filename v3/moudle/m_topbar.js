function createTopBar(topbarElement) {
    var title = topbarElement.data('title') ? topbarElement.data('title') : defaultTitle,
        navItems = topbarElement.data('navitems') ? topbarElement.data('navitems') : defaultNavItems,
        navRightItems = topbarElement.data('navrightitems') ? topbarElement.data('navrightitems') : defaultNavRightItems,
        homeUrl = topbarElement.data('homeurl') ? topbarElement.data('homeurl') : window.location.origin;

    navRightItems.push({
        text: '<i class="bi bi-gear-fill"></i>',
        href: `javascript:createDialog('set', 'primary', '站点偏好', '设置站点默认行为');`
    });

    if ($(window).width() <= 768 && topbarElement.data('showexpendbutton') !== false) {
        navRightItems.push({
            text: '<span class="device_OnlyPhone"><i class="bi bi-list"></i></span>',
            href: `javascript:expandNewTopBar();`
        });
    }

    // 创建标题部分
    $('<h1/>', {
        'class': 'navLeft',
        'id': 'pageTitle',
        html: $('<a/>', {
            href: homeUrl,
            html: title,
        })
    }).appendTo(topbarElement);

    // 创建导航左侧部分
    var navLeft = $('<ul/>', {'class': 'navCenter'}).appendTo(topbarElement);
    navItems.forEach(function(item) {
        if (window.location.href.indexOf(item.href) !== -1) {
            var cleanedText = item.text.replace(/<i[^>]*?>.*?<\/i>|&nbsp;/gi, ''); 
            document.title = cleanedText.trim() + ' | ' + webTitle;
        }
        $('<li/>', {
            html: $('<a/>', {
                href: item.href,
                html: item.text,
                click: function(e) {
                    e.preventDefault();
                    var cleanedText = item.text.replace(/<i[^>]*?>.*?<\/i>|&nbsp;/gi, ''); 
                    document.title = cleanedText.trim() + ' | ' + webTitle;
                    history.pushState('', '', item.href + '/');
                    setActiveLinkInTopbar($('topbar'));
                    fetchAndReplaceContent(item.href, 'main', 'main',()=>{
                        reloadScript(assetsURL + "/moudle/m_lead.js");
                        reloadScript(assetsURL + "/moudle/m_footer.js");
                        if($("lead").length > 0) {
                            $("main").addClass('flex pb-0');
                        } else {
                            $("main").removeClass('flex pb-0');
                        }
                        if (topbarElement.data('loadcallback')) {
                            window[topbarElement.data('loadcallback')]();
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
        var navItems = $('topbar').data('navitems') ? $('topbar').data('navitems') : defaultNavItems;
        var miniNavBar = $('<div/>', {
            id: 'miniNavBar',
            'class': 'miniNavBar'
        }).append($('<ul/>', {'class': 'list'}).append(
            navItems.map(function(item) {
                return $('<li/>').append($('<a/>', {
                    href: item.href,
                    html: item.text,
                    class: (window.location.href.includes(item.href)) ? 'active' : ''
                }));
            })
        )).appendTo($('body'));
        showMiniTopbar = true;
    }
}

function addButtonToNavRight(iconClass, buttonText, linkHref, onClickJs) {
    var topbarElement = $('topbar');
    if (topbarElement.length) {
        var navRight = topbarElement.find('.navRight');
        if (navRight.length) {
            var newButton = $('<li/>')
                .append($('<a/>', {
                    href: linkHref || '#',
                    html: `<i class="${iconClass}"></i>${buttonText || ''}`,
                    click: function(e) {
                        e.preventDefault();
                        if (typeof onClickJs === 'function') {
                            onClickJs.call(this, e);
                        } else if (onClickJs) {
                            eval(onClickJs); 
                        }
                    }
                }));
            navRight.append(newButton);
        } else {
            console.warn('右侧导航栏元素未找到。');
        }
    } else {
        console.warn('顶级导航栏元素未找到。');
    }
}

function insertElementToNav(htmlContent, position) {
    var topbarElement = $('topbar');
    if (topbarElement.length) {
        var navRight = topbarElement.find('.navRight');
        if (navRight.length) {
            if (position == 'left') {
                navRight.prepend(htmlContent);
            } else {
                navRight.append(htmlContent);
            }
        } else {
            console.warn('右侧导航栏元素未找到。');
        }
    } else {
        console.warn('顶级导航栏元素未找到。');
    }
}

$('document').ready(function() {
    var topbarElement = $('topbar');
    if (topbarElement.length && topbarElement.data('noreplace') !== 'true') {
        topbarElement.empty();
        createTopBar(topbarElement);
    } else {
        console.log('未找到<topbar>元素，顶栏创建操作被忽略。');
    }
});