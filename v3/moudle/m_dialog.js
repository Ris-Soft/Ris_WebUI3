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
  const $dialogOverlay = $('<div>').addClass('dialog-overlay');
  const $dialogBox = $('<div>').addClass('dialog-box').css('borderTopColor', `var(--color-${theme})`);

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
        <select id="set_colorMode" class="textEditor" name="set_colorMode">
          <option value="auto" ${getCookie('colorMode') === 'auto' || getCookie('colorMode') === '' ? 'selected' : ''}>跟随系统</option>
          <option value="light" ${getCookie('colorMode') === 'light' ? 'selected' : ''}>浅色模式</option>
          <option value="dark" ${getCookie('colorMode') === 'dark' ? 'selected' : ''}>深色模式</option>
        </select>
      `);
      $footer.append($('<br>'));
      $footer.append(dialog_CreateButton('保存设定', () => {
        const setColorModeIndex = $('#set_colorMode').prop('selectedIndex');
        colorMode($('#set_colorMode option').eq(setColorModeIndex).val());
        createMessage('偏好设置修改成功', 'success');
        hideDialog($dialogOverlay, $dialogBox);
        onConfirm && onConfirm();
      }, theme).css('marginLeft', '5px'));
      break;
  }

  $dialogBox.append($header).append($body).append($footer);

  $('body').append($dialogOverlay).append($dialogBox);
}

const $messageContainer = $('<div>').addClass('message-container');
$('body').append($messageContainer);

let messageCounter = 0;

function createMessage(content, theme, duration = 3000) {
  const $message = $('<div>').addClass(`message message-${theme}`).text(content);
  $messageContainer.css('right', '20px').append($message);
  messageCounter++;
  setTimeout(() => {
    messageCounter--;
    setTimeout(() => $message.remove(), 300);
    if (messageCounter === 0) {
      $messageContainer.css('right', '-300px');
    }
  }, duration);
}

function hideDialog($overlay, $box) {
  $overlay.remove();
  $box.remove();
}