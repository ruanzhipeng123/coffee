import { NavBar, Form, Field, Button, Popup, Tabbar, TabbarItem, Swipe, SwipeItem, Search, Skeleton, GoodsAction, GoodsActionIcon, GoodsActionButton, Stepper, SwipeCell, Cell, Checkbox, SubmitBar, Empty, Icon, AddressList, AddressEdit, Uploader, Tab, Tabs } from 'vant'

const vants = [NavBar,Form,Field,Button,Popup,Tabbar,TabbarItem,Swipe,SwipeItem,Search,Skeleton,GoodsAction,GoodsActionIcon,GoodsActionButton,Stepper,SwipeCell,Cell,Checkbox,SubmitBar,Empty,Icon,AddressList,AddressEdit,Uploader,Tab,Tabs ]

export default {
    /**
     * Vue.use 方法会自动调用install函数
     * Install Vant Component plugin
     * 
     */
    install(Vue) {
        vants.forEach(Component => {
            Vue.use(Component)
        })
    }
}