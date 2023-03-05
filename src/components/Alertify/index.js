import alertifyjs from 'alertifyjs/build/alertify';

export const alertifyPrompt = (body) => {
    return alertifyjs.alert()
            .setting({
                'label': 'Ok',
                'frameless': true,
                'closable': false,
                'padding': true,
                'message': body,
            }).show();
}

export const alertifyCloseAllPrompt = () => {
    return alertifyjs.alert().close();
}