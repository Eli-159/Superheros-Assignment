// Declares new class DataFetch
class DataFetch {
    // Defines a basic constructor function
    constructor(url, method, body, ext, opts) {
        // Sets basic class properties
        this.url = url ? url : '';
        this.method = method ? method.toUpperCase() : 'GET';
        this.body = body ? body : {};
        this.response = {};
        this.ext = ext;
        this.customOpts = opts;
    }

    // Defines the function fetch as a property of the class
    fetch = () => {
        // Returns a promise
        return new Promise((resolve, reject) => {
            // Tests that the required properties are set, throwing errors if not
            if (!this.url || this.url == '') {
                reject(new Error('No URL for Request. This is a required parameter.'));
            }
            if (!this.method || this.method == '') {
                reject(new Error('No Method for Request. This is a required parameter.')); 
            }
            if (!this.body || typeof this.body != 'object') {
                reject(new Error('Invalid Body for Request'));
            }

            // Sets the request id
            this.reqId = Date.now();
            this.body.reqId = this.reqId;

            // Declares a request variable and sets the basic paramaters
            let request;
            if (this.ext !== true) {
                const reqOpts = {
                    method: this.method,
                    mode: 'same-origin',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    redirect: 'follow',
                    headers: {
                        'Accept': 'application/json'
                    }
                }

                // Tests the method of the request, and configures the request options accordingly.
                if (this.method == 'PUT' || this.method == 'POST') {
                    reqOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    reqOpts.body = this.encodeBody();
                    request = fetch(this.url, reqOpts);
                } else {
                    request = fetch(`${this.url}?${this.encodeBody()}`, reqOpts);
                }
            } else {
                request = fetch(`${this.url}?${this.encodeBody()}`, this.customOpts);
            }
            
            request
            .then(data => {
                // Saves the status code and headers before passing the json
                this.response.status = data.status;
                this.response.headers = data.headers;
                return data.json();
            })
            .then(data => {
                // Saves response data in json
                if (this.ext !== true) {
                    if (data.redirect.set === true) window.location.href = data.redirect.url;
                    this.response.success = data.success;
                    this.response.errors = data.errors;
                    this.response.user = data.user;
                    this.response.request = data.request;
                    this.response.data = data.data;
                } else {
                    this.response.data = data;
                }
                // Tests if successful, resolving the promise if it is
                if (this.response.success || this.ext === true) {
                    resolve(data);
                } else {
                    // Triggers an error if one is present and rejects the promise
                    if (this.ext !== true && this.response.errors.length > 0) {
                        this.trigErr(this.response.errors[0]);
                    }
                    reject();
                }
            })
            .catch(() => {
                // Trigers an error and rejects the promise
                this.trigErr('An Unexpected Error Occured');
                reject();
            });
        });
    }

    // Declares a function to make the body of the request URL safe.
    encodeBody = () => {
        // Gets the body object keys and declares a variable for the formatted output
        const keys = Object.keys(this.body);
        const formattedArray = [];
        // Loops over and formats the array using existing JS functions
        keys.forEach(key => {
            formattedArray.push(`${key}=${encodeURIComponent(this.body[key])}`);
        });
        // Saves and returns the encoded body
        this.encodedBody = encodeURI(formattedArray.join('&'));
        return this.encodedBody;
    }

    // Declares a function to show an error message
    trigErr = (msg) => {
        // Creates and modifies a new div element
        const div = document.createElement('div');
        div.classList.add('fadeHide');
        div.classList.add('floatingError');
        div.id = `error${Date.now()}`;
        // Creates and fills a new paragraph element, appending it to the div
        const p = document.createElement('p');
        p.innerHTML = msg;
        div.appendChild(p);
        // Appends the div to the body.
        document.getElementsByTagName('body')[0].appendChild(div);
        // Removes and adds the 'fadeHide' class to achieve a fade on and off effect
        setTimeout(() => document.getElementById(div.id).classList.remove('fadeHide'), 1);
        setTimeout(() => document.getElementById(div.id).classList.add('fadeHide'), 5000);
        // Removes the error from the DOM
        setTimeout(() => document.getElementById(div.id).remove(), 6000);
    }

    // Declares a function to load the new data into the HTML
    loadFillHTML = (clearLoopData, container, customData) => {
        const fillArea = container ? container : document.getElementsByTagName('html')[0];
        // Declares a sub-function to modify and element's attributes
        const setElVals = (el, attPref, loopInt) => {
            // Get and loops over all attributes
            const atts = el.getAttributeNames();
            for (let i = 0; i < atts.length; i++) {
                // Tests if they are relevent for modification
                if (atts[i].includes(`${attPref}-fill`) || atts[i].includes(`${attPref}-if`) || atts[i].includes(`${attPref}-hide`) || atts[i].includes(`${attPref}-ex`)) {
                    // Gets the value to be added from the given function
                    const valFunc = new Function('r', 's', 'q', 'c', 'i', `return ${el.getAttribute(atts[i])}`);
                    const subVal = valFunc(this.response, el, new URLSearchParams(window.location.search), customData, loopInt);
                    // Tests if the data is to be filled straight into the element
                    if (atts[i] == `${attPref}-fill`) {
                        // Tests if the attribute has a value, setting the inner HTML if so.
                        if (el.getAttribute(`${attPref}-fill`)) {
                            el.innerHTML = subVal; 
                        }
                    // Tests if the attribute is an if statement pertaining to an attribute
                    } else if (atts[i].includes(`${attPref}-if-`)) {
                        // Adds the attribute if it evaluates to true
                        if (subVal === true) {
                            const newAttName = atts[i].substring(`${attPref}-if-`.length);
                            el.setAttribute(newAttName, '')
                        }
                    // Test if the attribute is an if statement pertaining to the whole element
                    } else if (atts[i].includes(`${attPref}-if`)) {
                        if (subVal === false) el.remove();
                    // Test if the attribute is a hide statement
                    } else if (atts[i].includes(`${attPref}-hide`)) {
                        if (subVal === true) el.classList.add('hide');
                        else el.classList.remove('hide');
                    } else if (atts[i].includes(`${attPref}-fill-`)) {
                        // Adds the evaluated value to the given attribute of the element
                        const newAttName = atts[i].substring(`${attPref}-fill-`.length);
                        el.setAttribute(newAttName, subVal);
                    }
                }
            }
        }

        // Gets all elements with the attribute 'data-fill' or 'data-ex'
        const dataFillElements = fillArea.querySelectorAll('[data-fill], [data-if], [data-ex], [data-hide]');
        // Loops over them, calling the 'setElVals' function on each
        for (let i = 0; i < dataFillElements.length; i++) {
            const el = dataFillElements[i];
            setElVals(el, 'data');
        }

        // Gets all elements with attribute 'data-loop' and loops over them
        const loopElements = fillArea.querySelectorAll('[data-loop]');
        for (let i = 0; i < loopElements.length; i++) {
            // Gets the element and the loop data from the provided function.
            const refEl = loopElements[i];
            const loopRefFunc = new Function('r', 's', 'q', 'c', `return ${refEl.getAttribute('data-loop')}`);
            const loopData = loopRefFunc(this.response, refEl, new URLSearchParams(window.location.search), customData);
            // Remove any existing filled data
            if (clearLoopData === true) this.resetLoopSection(refEl.parentElement);
            // Loops over the given data
            for (let x = 0; x < loopData.length; x++) {
                // Creates a the new element, making basic modifications
                const newEl = refEl.cloneNode(true);
                newEl.classList.remove('template');
                newEl.removeAttribute('id');
                newEl.removeAttribute('data-loop');
                // Calls the 'setElVals' function on the main element
                setElVals(newEl, 'data-loop', x);
                // Gets and loops over all sub elements with the attribute 'data-loop-fill'
                const subEls = newEl.querySelectorAll('[data-loop-fill], [data-loop-if], [data-loop-ex], [data-loop-hide]');
                for (let y = 0; y < subEls.length; y++) {
                    // Calls the 'setElVals' function on each.
                    setElVals(subEls[y], 'data-loop', x);
                }
                // Appends the element below the original one.
                refEl.parentElement.appendChild(newEl);
            }
        }
    }

    resetLoopSection = (parent) => {
        if (parent && parent.children) {
            for (let i = parent.children.length-1; i >= 0; i--) {
                if (!(parent.children[i].classList.contains('template') || parent.children[i].classList.contains('data-loop-keep'))) {
                    parent.children[i].remove();
                }
            }
        }
    }
}