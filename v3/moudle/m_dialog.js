function dialog_CreateButton(text, onClick, theme) {
  const button = $('<button>', {
    text: text,
    class: `btn btn-${theme} btn-md`,
  }).on('click', onClick);
  return button;
}

function dialog_CreateType(text, typeRequire, theme) {
  const type = $('<input>', {
    placeholder: text,
    required: typeRequire,
    class: `textEditor textEditor-${theme}`,
    id: 'textType',
  });
  return type;
}

function createDialog(type, theme, title, content, onConfirm, onCancel, typeRequire, typeNotice) {
  // 生成随机数作为 ID
  const dialogId = Math.floor(Math.random() * 1000000); // 假设这足够唯一

  const $dialogOverlay = $('<div>')
    .addClass('dialog-overlay')
    .addClass(`${dialogId}_overlay`);

  const $dialogBox = $('<div>')
    .addClass('dialog-box')
    .addClass(`${dialogId}_box`)
    .css('borderTopColor', `var(--color-${theme})`);

  const $header = $('<div>').addClass('dialog-header');
  const $headerText = $('<h3>').text(title);
  $header.append($headerText);

  const $body = $('<div>').addClass('dialog-body');
  const $bodyText = $('<p>').html(content);
  $body.append($bodyText);

  const $footer = $('<div>').addClass('dialog-footer');

  switch (type) {
    case 'alert':
      const $confirmBtn = dialog_CreateButton('确认', () => {
        hideDialog($dialogOverlay, $dialogBox);
        onConfirm && onConfirm();
      }, theme);
      $footer.append($confirmBtn);
      break;
    case 'confirm':
      const $confirmNo = dialog_CreateButton('取消', () => {
        hideDialog($dialogOverlay, $dialogBox);
        onCancel && onCancel();
      }, `${theme}-e`);
      const $confirmYes = dialog_CreateButton('确定', () => {
        hideDialog($dialogOverlay, $dialogBox);
        onConfirm && onConfirm();
      }, theme).css('marginLeft', '5px');
      $footer.append($confirmNo).append($confirmYes);
      break;
    case 'type':
      $footer.append(dialog_CreateType(typeNotice, typeRequire, theme));
      $footer.append($('<br>'));
      $footer.append(dialog_CreateButton('取消', () => {
        hideDialog($dialogOverlay, $dialogBox);
        onCancel && onCancel();
      }, `${theme}-e`).css('marginTop', '10px'));
      $footer.append(dialog_CreateButton('提交', () => {
        const text = $('#textType').val();
        if (typeRequire && text === "") {
          createMessage('请输入信息后提交', 'danger');
          return;
        }
        hideDialog($dialogOverlay, $dialogBox);
        onConfirm && onConfirm(text);
      }, theme).css('marginLeft', '5px'));
      break;
    case 'set':
      $footer.html(`
      <div class="flex" style="flex-direction: column;text-align:left">
      <span>网页主题：</span>
        <select id="set_colorMode" class="textEditor" name="set_colorMode">
          <option value="auto" ${getCookie('set_colorMode') === 'auto' || getCookie('colorMode') === '' ? 'selected' : ''}>深浅自适应</option>
          <option value="light" ${getCookie('set_colorMode') === 'light' ? 'selected' : ''}>浅色主题</option>
          <option value="dark" ${getCookie('set_colorMode') === 'dark' ? 'selected' : ''}>深色主题</option>
          <option value="diy:ios" ${getCookie('set_colorMode') === 'diy:ios' ? 'selected' : ''}>怀旧</option>
          <option value="diy:new" ${getCookie('set_colorMode') === 'diy:new' ? 'selected' : ''}>新生</option>
        </select>
      <span>进度条：</span>
        <select id="set_progressBar" class="textEditor" name="set_progressBar">
          <option value="default" ${getCookie('set_progressBar') === 'default' ? 'selected' : ''}>始终显示</option>
          <option value="deny" ${getCookie('set_progressBar') === 'deny' ? 'selected' : ''}>禁用进度条</option>
        </select>
        </div>
      `);
      $footer.append(dialog_CreateButton('保存设定', () => {
        const setProgressBarIndex = $('#set_progressBar').prop('selectedIndex');
        const setColorModeIndex = $('#set_colorMode').prop('selectedIndex');
        colorMode($('#set_colorMode option').eq(setColorModeIndex).val());
        setCookie('set_progressBar',
        $('#set_progressBar option').eq(setProgressBarIndex).val(),
        3650
        , document.domain.split('.').slice(-2).join('.'));
        createMessage('偏好设置修改成功', 'success');
        hideDialog($dialogOverlay, $dialogBox);
        onConfirm && onConfirm();
      }, theme).css('marginLeft', '5px'));
      break;
  }

  $dialogBox.append($header).append($body).append($footer);
    
  $('body').append($dialogOverlay).append($dialogBox);
 
 return dialogId;
}

const $messageContainer = $('<div>').addClass('message-container').appendTo('body');
let activeMessagesCount = 0;
function createMessage(content, theme, duration = 3000, autoClose = true) {
  const $message = $('<div>')
    .addClass(`message message-${theme}`)
    .html(content)
    .hide();
  if ($('topbar').length <= 0) {
      $messageContainer.css('top', '10px')
  }
  $messageContainer.css('right', '20px').append($message);
  $message.fadeIn();
  activeMessagesCount++;

  if (autoClose) {
    setTimeout(() => {
      activeMessagesCount--;
      $message.fadeOut(300, () => {
        $message.remove();
      });
      if (activeMessagesCount === 0) {
        $messageContainer.css('right', '-300px');
      }
    }, duration);
  }
}

function hideDialog($overlay, $box) {
  $overlay.remove();
  $box.remove();
}