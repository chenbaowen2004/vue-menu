import { Component, Vue, Prop, Inject } from "vue-property-decorator"
import { MenubarType, MENUBAR_KEY } from "../menubar/script"
import { MenuType } from "../menu/script"
import Menu from "../menu/index.vue"
import { sync } from "../global"
import { MenubaritemActivateEvent, MenuCloseEvent, MenubarDactivateEvent } from "../event"
import { MenuStyle, MENU_STYLE_KEY } from "../style"


export const MENUBARITEM_KEY = '@hscmap/vue-menu/menubaritem'


@Component({
    components: { XMenu: Menu },
    provide() { return { [MENUBARITEM_KEY]: this } }
})
export class MenubaritemType extends Vue {
    @Prop({ type: String, required: true })
    private label!: string

    @Inject(MENUBAR_KEY)
    private menubar!: MenubarType

    @Inject(MENU_STYLE_KEY)
    private menuStyle!: MenuStyle

    @Prop({ type: Boolean, default: false })
    disabled!: boolean

    private hover = false
    private isOpen = false

    mounted() {
        this.menu().$on(MenuCloseEvent.type, (e: MenuCloseEvent) => {
            this.isOpen = false
            e.fromChild && this.menubar.deactivate()
        })
        this.menubar.$on(MenubaritemActivateEvent.type, (e: MenubaritemActivateEvent) => {
            if (this != e.menubaritem) {
                const menu = this.menu()
                menu && menu.close(false)
            }
        })
        this.menubar.$on(MenubarDactivateEvent.type, (e: MenubarDactivateEvent) => {
            const menu = this.menu()
            menu && menu.close(true)
        })
    }

    onMenuiatemFired() {
        setTimeout(() => {
            this.hover = false
        }, 200)
    }

    // get style() {
    //     return this.active ? this.menuStyle.active : {}
    // }
    get style() {
        const { active, disabled } = this.menuStyle
        return { ...(this.active ? active : {}), ...(this.disabled ? disabled : {}) }
    }

    get paddingTop() {
        return `${this.menubar.paddingTop}px`
    }

    private menu() {
        return this.$refs.menu as MenuType
    }

    private activate() {
        const rect = this.$el.getBoundingClientRect()
        this.menu().open(rect.left, rect.bottom)
        this.menubar.$emit(MenubaritemActivateEvent.type, new MenubaritemActivateEvent(this))
        this.isOpen = true
    }

    private mousedown() {
        this.disabled || sync.lock(async () => {
            this.activate()
        })
    }

    private mouseenter() {
        this.disabled || sync.lock(async () => {
            this.hover = true
            this.menubar.active && this.activate()
        })
    }

    private mouseleave() {
        this.disabled || sync.lock(async () => {
            this.hover = false
        })
    }

    get active() {
        return this.hover || this.isOpen
    }
}