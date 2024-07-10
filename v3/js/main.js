/* 腾瑞思智 用户界面样式 版本3 配套JavaScript*/
/* Created By PYLXU*/


    if(document.title === "") {
    document.title = webTitle;
    }

// 置入进度条
$(document).ready(function() {
            var progressBar = $('<div id="progressBar"><div class="bar"></div></div>');
            $('body').prepend(progressBar);
        });

    function setCookie(name, value, days = null, domain, path = '/') {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + ";domain=" + domain + ";path=" + path;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function loadOrUnloadCSS(url, shouldLoad = true) {
        const $existingLink = $('link[href="' + url + '"]');
        if (shouldLoad && !$existingLink.length) {
            $('<link>', { rel: 'stylesheet', href: url }).appendTo('head');
        } else if (!shouldLoad && $existingLink.length) {
            $existingLink.remove();
        }
    }

    function colorMode(mode = 'auto', save = true) {
        let trueMode = mode !== 'auto' ? mode === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (save) {
            setCookie('colorMode', mode, 3650, document.domain.split('.').slice(-2).join('.'));
        }
        loadOrUnloadCSS('https://assets.3r60.top/v3/css/dark.css', trueMode);
    }

async function fetchAndReplaceContent(url, remoteSelector, targetSelector, callback) {
    const progressBar = document.querySelector('#progressBar .bar');
    progressBar.style.display = 'block';
    progressBar.style.width = '0%';
    setTimeout(() => { progressBar.style.width = '20%' }, 100);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const $remoteContent = doc.querySelector(remoteSelector);

        progressBar.style.width = '80%';

        if ($remoteContent) {
            const targetElement = document.querySelector(targetSelector);
            targetElement.innerHTML = $remoteContent.innerHTML;

            const scripts = extractScripts($remoteContent.innerHTML);
            executeScripts(scripts); // 等待所有脚本执行完毕

            setTimeout(() => { progressBar.style.width = '100%' }, 500);
            setTimeout(() => { progressBar.style.width = '0%'; progressBar.style.display = 'none' }, 1000);

            if (callback && typeof callback === 'function') {
                callback(); // 执行回调函数
            }
        } else {
            console.error('Content not found at remote selector.'); // 错误日志记录
            window.location.href = url;
        }
    } catch (error) {
        console.error(`Failed to fetch content: ${error}`); // 错误日志记录
        window.location.href = url;
    }
}

function extractScripts(html) {
    const scriptTags = html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi);
    const scripts = [];

    if (scriptTags) {
        scriptTags.forEach(scriptTag => {
            // 移除<script>和</script>标签
            const scriptContent = scriptTag.replace(/<script\b[^<]*>|<\/script>/gi, '');
            scripts.push(scriptContent.trim());
        });
    }

    return scripts;
}

async function executeScripts(scripts) {
    for (let scriptContent of scripts) {
        try {
            // 创建并执行脚本
            const scriptTag = document.createElement('script');
            scriptTag.textContent = scriptContent;
            document.body.appendChild(scriptTag);
            await new Promise(resolve => {
                scriptTag.onload = resolve;
            });
        } catch (error) {
            console.error('Failed to execute script:', error);
        }
    }
}



    if (getCookie('colorMode') === 'dark' || getCookie('colorMode') === 'light') {
        colorMode(getCookie('colorMode'));
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            colorMode('dark', false);
        }
    }
function reloadScript(src) {
    // 获取所有的script标签
    var scripts = document.getElementsByTagName('script');
    
    // 遍历所有script标签，查找是否有相同的src属性
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src === src) {
            // 如果找到了相同的src属性，删除该script标签
            scripts[i].parentNode.removeChild(scripts[i]);
            break; // 找到后退出循环
        }
    }
    
    // 创建新的script标签并设置属性
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    
    // 将新的script标签添加到head中
    document.getElementsByTagName('head')[0].appendChild(script);
}

function defaultPage(pageId) {
    switch (pageId) {
        case '404':
            html = `<index><h2>页面不存在</h2><h4>404 Not Found</h4></index><footer></footer>`
            break;
        default:
            html = `<index><h2>页面不存在</h2><h4>404 Not Found</h4></index><footer></footer>`
    }
    return(html);
}
