Vue.filter('dashed', function (value) {
    return value.replace(/\s+/g, '-');
});

var dataField = new Vue({
    el: '#base',
    data: {
        currentView: 'welcome',
        treeData: []
    },
    ready: function () {
        this.$http.get('http://localhost/site/webcore/item_module').then(function(response) {
            this.treeData = response.data;
        });
    },
    events: {
        'item-in-action': function(message) {
            this.$broadcast('context-menu-status', message);
        }
    },
    methods: {
        saveItem: function () {
            console.log(JSON.parse(JSON.stringify(this.treeData)));
        }
    },
    components: {
        itemTree: {
            name: 'item-tree',
            template: '#item-tree-template',
            props: {
                model: Object
            },
            data: function () {
                return {
                    open: false,
                    viewMenu: false,
                    top: '0px',
                    left: '0px'
                }
            },
            computed: {
                isFolder: function () {
                    return this.model.children/* &&
                     this.model.children.length*/
                },
                isActive: function () {
                    return this.model.active
                },
                isWebcore: function () {
                    return this.model.name === 'Webcore' ||
                        this.$parent.model.name === 'Webcore'
                },
                isSchema: function () {
                    return this.model.name === 'Schema' ||
                        this.$parent.model.name === 'Schema'
                }
            },
            events: {
                close: function () {
                    this.open = false;
                    return true
                }
            },
            methods: {
                setActive: function () {
                    this.isActive = true ;
                },
                /*addFolder: function () {
                    var name = prompt('Folder name?');

                    this.model.children.push({
                        name: name,
                        children: []
                    });

                    this.open = true
                },
                addItem: function () {
                    var name = prompt('Item name?');

                    this.model.children.push({
                        name: name,
                        item: this.$parent.$els.item.className.split(' ')[1]
                    });

                    this.open = true;
                },*/
                /*setMenu: function(top, left) {
                    largestHeight = window.innerHeight - this.$els.right.offsetHeight - 25;
                    largestWidth = window.innerWidth - this.$els.right.offsetWidth - 25;

                    if (top > largestHeight) top = largestHeight;

                    if (left > largestWidth) left = largestWidth;

                    this.top = top + 'px';
                    this.left = left + 'px';
                },*/
                /*closeMenu: function() {
                    this.viewMenu = false;
                },*/
                openMenu: function(e) {
                    var message = {
                        obj: this,
                        open: true,
                        x: e.pageX,
                        y: e.pageY
                    };

                    this.$dispatch('item-in-action', message);

                    /*this.viewMenu = true;

                    Vue.nextTick(function() {
                        this.$els.right.focus();
                        this.setMenu(e.pageY, e.pageX)
                    }.bind(this));*/
                }
            }
        },
        itemContextMenu: {
            template: '#context-menu-template',
            data: function () {
                return {
                    obj: {},
                    viewMenu: false,
                    top: '0px',
                    left: '0px'
                }
            },
            events: {
                'context-menu-status': function(message) {
                    this.obj = message.obj;
                    this.viewMenu = message.open;
                    this.top = message.y + 'px';
                    this.left = message.x + 'px';
                }
            },
            methods: {
                closeMenu: function() {
                    this.viewMenu = false;
                    this.top = '0px';
                    this.left = '0px';
                },
                addFolder: function () {
                    var name = prompt('Folder name?');

                    this.obj.model.children.push({
                        name: name,
                        children: []
                    });
                },
                addItem: function () {
                    var name = prompt('Item name?');

                    this.obj.model.children.push({
                        name: name/*,
                        item: this.obj.$parent.$els.item.className.split(' ')[1]*/
                    });

                    this.obj.open = true;
                }
            }
        },
        welcome: {
            template: '#webcore-welcome'
        },
        content: {
            template: '#data-field',
            data: function() {
                return {
                    fields: [],
                    dataField: {},
                    dataFields: []
                }
            },
            ready: function() {
                this.fetchFields();
            },
            methods: {
                fetchFields: function() {
                    this.$set('fields', fields);
                },
                addDataField: function() {
                    if(this.dataField.title) {
                        this.dataFields.push(this.dataField);
                    }
                }
            }
        },
        asset: {
            template: '#asset-data'
        },
        object: {
            template: '#ui-data-component'
        },
        schema: {
            template: '#data-field-definition',
            data: function() {
                return {
                    field: {title: '', description: '', type: '', placeholder: '', value: '', readonly: false},
                    fields: []
                }
            },
            ready: function() {
                this.fetchFields();
            },
            methods: {
                fetchFields: function() {
                    this.$set('fields', fields);
                },
                addField: function() {
                    if(this.field.title) {
                        this.fields.push(this.field);
                        this.field = {title: '', description: '', type: '', placeholder: '', value: '', readonly: false};
                    }
                },
                deleteField: function(index) {
                    if(confirm("Are you sure you want to delete this field?")) {
                        this.fields.splice(index, 1);
                    }
                },
                saveField: function() {
                    console.log(JSON.parse(JSON.stringify(this.fields)));
                }
            }
        }
    }
});