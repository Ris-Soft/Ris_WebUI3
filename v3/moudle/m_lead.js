var tempTitle = document.title;
var $lead = $('lead');
if ($lead.length) {
    if (!$lead.children().length) {
        $lead.append('<ul class="list"></ul><footer></footer>');
    }
    $lead.append('<button class="btn btn-shadow btn-white btn-sm" id="leadToggleBtn"><i class="bi bi-text-indent-right"></i></button>');
}
var currentUrl = window.location.href;
var $toggleBtn = $('#leadToggleBtn');
if ($lead.css('left') === '-250px') {
    $toggleBtn.find('i').removeClass('bi-text-indent-right').addClass('bi-text-indent-left');
}

$toggleBtn.on('click', function () {
    var currentLeft = parseInt($lead.css('left'), 10);
    var newLeft = (currentLeft === 0) ? -250 : 0;
    var duration = 300;

    $({ left: currentLeft }).animate({ left: newLeft }, {
        duration: duration,
        step: function (now) {
            $lead.css('left', now);
            $('content').css('marginLeft', 250 + now);
            if (window.innerWidth > 768) {
                $('content').css('width', $(window).width() - (310 + now));
            } else {
                $('content').css('width', $(window).width() - 50);
            }

        },
        complete: function () {
            $toggleBtn.find('i').toggleClass('bi-text-indent-left bi-text-indent-right');
        }
    });
});

function setActiveLinkInList($list) {
    currentUrl = window.location.href;
    $list.find('li a').each(function () {
        var $this = $(this);
        var href = new URL($this.attr('href'), currentUrl).toString();
        if (href === currentUrl || href === currentUrl + 'index.html') {
            $this.addClass('active');
            if ($listElement.data('changetitle') != false) {
                document.title = $this.text() + ' - ' + tempTitle;
            }
        } else {
            $this.removeClass('active');
        }
    });
}

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP错误，错误码: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('获取目录文件出错:', error);
        return null;
    }
}

async function mergeAndAddProjects($list, newJsonData) {
    if (!newJsonData) return;

    newJsonData.forEach(item => {
        var $element;
        if (item.type === 'link') {
            $element = $('<a>', {
                href: item.href, html: item.text,
                click: function (e) {
                    if ($('lead').data('useajax') == false) {
                        window.location.href = item.href;
                    } else {
                        e.preventDefault();
                        fetchAndReplaceContent(item.href, 'content', 'content');
                        history.pushState('', '', item.href);
                        setActiveLinkInList($('.list'));
                    }
                }
            });
            if (new URL(item.href, window.location.href).toString() === currentUrl) {
                if ($listElement.data('changetitle') != false) {
                    document.title = item.text + ' - ' + document.title;
                }
                $element.addClass('active');
            }
        } else if (item.type === 'text') {
            $element = $('<span>', { html: item.text });
        }
        $('<li>').append($element).appendTo($list);
    });
}

async function populateListWithJson($list, navFrom = '') {
    let contentsJsonUrl = navFrom.endsWith('.json') ? navFrom : (navFrom ? navFrom + '/contents.json' : (typeof default_navFrom !== 'undefined' && default_navFrom ? (default_navFrom.endsWith('.json') ? default_navFrom : default_navFrom + '/contents.json') : (window.location.pathname.replace(/[^\/]+$/, '') + 'contents.json')));

    let jsonData = await fetchJson(contentsJsonUrl);

    if (jsonData && jsonData.some(item => item.type === 'url')) {
        const additionalJsonData = await fetchJson(jsonData.find(item => item.type === 'url').href);
        if (additionalJsonData) {
            jsonData = jsonData.concat(additionalJsonData);
        }
    }

    // $list.empty();

    await mergeAndAddProjects($list, jsonData);
}

if ($lead.length) {
    var $listElement = $('.list');
    if ($listElement.length) {
        setActiveLinkInList($listElement);
        if ($listElement.data('loadfromfile') != false) {
            populateListWithJson($listElement,$listElement.data('filename'))
                .then(() => console.log('列表项已成功从JSON文件加载并添加。'))
                .catch(error => console.error('加载列表项时出错:', error));
        }
    } else {
        console.log('未找到.class为list的ul元素，激活链接操作及列表项加载被忽略。');
    }
} else {
    console.log('未找到<lead>元素，侧栏创建操作被忽略。');
}
