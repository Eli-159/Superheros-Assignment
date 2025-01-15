class FormSubmit {
    constructor(formId, submitNow, submitFunc) {
        if (submitFunc) this.submitFunc = submitFunc;
        if (formId && typeof formId == 'string') {
            this.formId = formId;
            this.setForm(submitNow);
        } else {
            const forms = document.getElementsByTagName('form');
            if (forms.length > 0) {
                if (!forms[0].getAttribute('id')) {
                    forms[0].id = `form_${Date.now()}`;
                }
                this.formId = forms[0].getAttribute('id');
                this.setForm(submitNow);
            }
        }
    }

    setForm = (submitNow) => {
        const form = document.getElementById(this.formId);
        const submitFormFunc = () => {
            if (this.url && this.method) {
                const formData = new FormData(form);
                const submitData = {};
                formData.forEach((value, key) => (submitData[key] = value));
                this.req = new DataFetch(this.url, this.method, submitData);
                this.req.fetch().then(() => {
                    if (this.submitFunc) {
                        this.submitFunc();
                    }
                }).catch(() => {});
            }
        }
        if (submitNow) {
            submitFormFunc()
        } else {
            if (form.action) {
                this.url = form.action;
            }
            if (form.method) {
                this.method = form.method;
            }
            form.addEventListener('submit', event => {
                event.preventDefault();
                submitFormFunc();
            });
        }
    }
}