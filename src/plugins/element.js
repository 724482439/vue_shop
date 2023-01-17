import Vue from 'vue'
import { Button, Form, FormItem, Input, Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,CheckboxGroup,Upload,Timeline,TimelineItem } from 'element-ui'
// 循环注册
const elements = [Button, Form, FormItem, Input,Container,Header,Aside,Main,Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,CheckboxGroup,Upload,Timeline,TimelineItem ]
elements.forEach(item => Vue.use(item))

// 将弹框组件挂载在Vue的原型对象上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm