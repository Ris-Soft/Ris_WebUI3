/* 腾瑞思智 用户界面样式 版本3 配套JavaScript*/
/* Created By PYLXU*/


if (document.title === "") {
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
		$('<link>', {
			rel: 'stylesheet',
			href: url
		}).appendTo('head');
	} else if (!shouldLoad && $existingLink.length) {
		$existingLink.remove();
	}
}

function colorMode(mode = 'auto', save = true) {
	let trueMode = mode !== 'auto' || mode !== "" ? mode === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    let lastMode = getCookie('set_colorMode');
	if (mode.startsWith('diy:')) {
	    if (lastMode !== null) {
	        if (lastMode.startsWith('diy:')) {
	            loadOrUnloadCSS('https://assets.3r60.top/v3/css/theme/'+lastMode.slice(4)+'.css', false);
	        } else {
	            loadOrUnloadCSS('https://assets.3r60.top/v3/css/theme/'+lastMode+'.css', false);
	        }
	    }
        loadOrUnloadCSS('https://assets.3r60.top/v3/css/theme/'+mode.slice(4)+'.css', true);
	} else {
	    if (lastMode !== null) {
	        if (lastMode.startsWith('diy:')) {
	            loadOrUnloadCSS('https://assets.3r60.top/v3/css/theme/'+lastMode.slice(4)+'.css', false);
	        } else {
	            loadOrUnloadCSS('https://assets.3r60.top/v3/css/theme/'+lastMode+'.css', false);
	        }
	    }
        loadOrUnloadCSS('https://assets.3r60.top/v3/css/theme/dark.css', trueMode);
	}
	if (save) {
		setCookie('set_colorMode', mode, 3650, document.domain.split('.').slice(-2).join('.'));
	}
	if (mode == 'auto' || mode == "") {
		$(document).trigger('colorModeChanged', window.matchMedia('(prefers-color-scheme: dark)').matches == 'true' ? 'dark' : 'light');
	} else if(mode.startsWith('diy:')){
        $(document).trigger('colorModeChanged', 'light');
    } else {
		$(document).trigger('colorModeChanged', mode);
	}

}

function getColorMode() {
	mode = getCookie('set_colorMode');
	let trueMode = mode !== 'auto' ? mode === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (mode == 'auto' || mode == "") {
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	} else {
		return trueMode;
	}

}

async function fetchAndReplaceContent(url, remoteSelectors, targetSelectors, callback, postData) {
    const progressBar = document.querySelector('#progressBar .bar');
    let displaySetting = getCookie('set_progressBar') === 'deny' ? 'none' : 'block';
    progressBar.style.display = displaySetting;
    progressBar.style.width = '0%';
    setTimeout(() => {
        progressBar.style.width = '20%'
    }, 100);

    try {
        const fetchOptions = {
            method: 'POST', // 使用 POST 方法
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // 设置 Content-Type
            },
            body: null,
        };

        if (postData) {
            const encodedData = Object.keys(postData).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(postData[key])}`).join('&');
            fetchOptions.body = encodedData;
        }

        const response = await fetch(url, fetchOptions); // 发送请求时带上 fetchOptions
        if (!response.ok) {
            throw new Error(`HTTP 错误！状态码：${response.status}`);
        }

        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        setTimeout(() => {
            progressBar.style.width = '80%'
        }, 500);

        const remoteSelectorArray = remoteSelectors.includes(',') ?
            remoteSelectors.split(',') :
            [remoteSelectors];
        const targetSelectorArray = targetSelectors.includes(',') ?
            targetSelectors.split(',') :
            [targetSelectors];

        if (remoteSelectorArray.length !== targetSelectorArray.length) {
            console.error('远程元素与本地元素数目不对应！');
            return;
        }

        remoteSelectorArray.forEach((remoteSelector, index) => {
            const trimmedRemoteSelector = remoteSelector.trim();
            const trimmedTargetSelector = targetSelectorArray[index].trim();

            const $remoteContent = doc.querySelector(trimmedRemoteSelector);

            if ($remoteContent) {
                const targetElement = document.querySelector(trimmedTargetSelector);
                targetElement.innerHTML = $remoteContent.innerHTML;

                const scripts = extractScripts($remoteContent);
                executeScripts(scripts);
            } else {
                console.error(`无法找到远程元素: ${trimmedRemoteSelector}.`);
                window.location.href = url;
            }
        });

        if (callback && typeof callback === 'function') {
            callback();
        }

        setTimeout(() => {
            progressBar.style.width = '100%'
        }, 500);
        setTimeout(() => {
            progressBar.style.width = '0%';
            progressBar.style.display = 'none';
        }, 1000);

    } catch (error) {
        console.error(`获取文本失败: ${error}`);
        window.location.href = url;
    }
    $(document).trigger('pageChanged',url);
}

function extractScripts($element) {
	const scripts = [];

	const scriptElements = $element.querySelectorAll('script');
	scriptElements.forEach(scriptElement => {
		if (scriptElement.src) {
			scripts.push(scriptElement.src);
		} else {
			const scriptContent = scriptElement.textContent.trim();
			scripts.push(scriptContent);
		}
	});

	return scripts;
}

function executeScripts(scripts) {
	scripts.forEach(scriptContent => {
		try {
			if (typeof scriptContent === 'string') {
				// Create a new script tag and append it to the body
				const scriptTag = document.createElement('script');
				scriptTag.textContent = scriptContent;
				document.body.appendChild(scriptTag);
			} else if (typeof scriptContent === 'object') {
				// Load the script from its source
				const scriptTag = document.createElement('script');
				scriptTag.src = scriptContent;
				document.head.appendChild(scriptTag);
			}
		} catch (error) {
			console.error('Failed to execute script:', error);
		}
	});
}

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeQuery.addListener(handleDarkModeChange);

function handleDarkModeChange(e) {
    if (getCookie('set_colorMode') == 'auto' && getCookie('set_colorMode') == '') {
    	if (e.matches) {
    		colorMode('dark', false);
    	} else {
    		colorMode('light', false);
    	}
    }
}

window.addEventListener('DOMContentLoaded', function() {
	colorMode(getCookie('set_colorMode'));
})


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
	document.getElementsByTagName('body')[0].appendChild(script);
}

function defaultPage(pageId) {
	switch (pageId) {
		case '404':
			html = `<index><h2>页面不存在</h2><h4>404 Not Found</h4></index><footer></footer>`
			break;
		default:
			html = `<index><h2>页面不存在</h2><h4>404 Not Found</h4></index><footer></footer>`
	}
	return (html);
}