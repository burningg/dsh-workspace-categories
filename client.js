window.__ModuleLoader__.load({
  id: '@burningg/dsh-workspace-categories',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /**
     * The shipped primitives package carries the real sidebar glyphs. Use its
     * own new-chat icon when the host exposes it, so the row action is pixel
     * identical to the native one instead of a redrawn lookalike.
     */
    let primitives = null;
    try { primitives = require('@deepseek-ai/dsh-client-ui-primitives'); } catch { primitives = null; }

    const MenuPrimitive = primitives && typeof primitives.Menu === 'function' ? primitives.Menu : null;
    const pickIcon = (name) => (
      primitives && typeof primitives[name] === 'function' ? primitives[name] : null
    );
    const IconEllipsis = pickIcon('IconEllipsisOutlineRegular');
    const IconEdit = pickIcon('IconEditOutlineRegular');
    const IconTrash = pickIcon('IconTrashOutlineRegular');
    const IconFolderOpen = pickIcon('IconFolderOpenOutlineRegular');
    const IconCode = pickIcon('IconCodeOutlineRegular');

    const NS = 'dsh-workspace-categories';
    const PANEL_ID = 'workspace-categories';
    const STORAGE_KEY = 'dsh.workspace-categories.v2';
    const LEGACY_KEY = 'dsh.workspace-categories.v1';
    const ACCENTS = ['#2F6FED', '#0E9F9A', '#22A06B', '#D97706', '#DC2626', '#A855F7', '#DB2777', '#0891B2'];
    const SESSION_PAGE = 5;
    const FONT_MIN = 11;
    const FONT_MAX = 20;
    const IS_MAC = typeof navigator !== 'undefined'
      && /mac/i.test(String(navigator.platform || '') + ' ' + String(navigator.userAgent || ''));

    /**
     * Per-viewer styling for the three list levels. Sizes are px and stay inside
     * FONT_MIN..FONT_MAX; an empty colour string means "follow the Harness
     * theme". Categories keep their own accent (`category.color`) instead of a
     * single global category colour.
     */
    const APPEARANCE_DEFAULTS = {
      categoryFontSize: 14,
      workspaceFontSize: 14,
      sessionFontSize: 13,
      workspaceColor: '',
      sessionColor: '',
      categoryBg: '',
      cardBg: '',
      panelBg: '',
      accentNames: false,
    };

    const DICT = {
      en: {
        'panel.title': 'Workspace categories',
        'panel.subtitle': 'Collect scattered workspaces into named groups. Turn on the sidebar grouping to see them where you work.',
        'panel.newCategory': 'New category',
        'panel.searchPlaceholder': 'Search workspaces…',
        'panel.count': '{n} workspaces',
        'panel.sessions': '{n} chats',
        'panel.defaultName': 'New category',
        'panel.uncategorized': 'Uncategorized',
        'panel.uncategorizedHint': 'Drag a workspace onto a category, or pick one from its menu.',
        'panel.addWorkspace': 'Add workspace…',
        'panel.remove': 'Remove from category',
        'panel.moveTo': 'Move to category',
        'panel.rename': 'Rename',
        'panel.delete': 'Delete category',
        'panel.confirmDelete': 'Delete this category?',
        'panel.cancel': 'Cancel',
        'panel.open': 'Open workspace',
        'panel.dropHere': 'Drop a workspace here',
        'panel.dragHint': 'Drag a row onto a category card · click a row to open the workspace',
        'panel.empty': 'No workspaces yet. Add one from the sidebar first.',
        'panel.noMatch': 'No workspace matches this search.',
        'panel.loading': 'Loading workspaces…',
        'panel.sidebarToggle': 'Group the sidebar by category',
        'panel.sidebarHint': 'On, the left list is grouped by category (needs at least one category). Off, the built-in list returns.',
        'panel.appearance': 'Appearance',
        'panel.categoryColor': 'Category colour',
        'appearance.title': 'Appearance',
        'appearance.tip': 'Sizes, colours and backgrounds apply live.',
        'appearance.fontSize': 'Size',
        'appearance.color': 'Colour',
        'appearance.background': 'Background',
        'appearance.category': 'Category',
        'appearance.workspace': 'Workspace',
        'appearance.session': 'Chat',
        'appearance.categoryBg': 'Group band',
        'appearance.cardBg': 'Card',
        'appearance.panelBg': 'Panel',
        'appearance.auto': 'Auto',
        'appearance.reset': 'Reset',
        'appearance.close': 'Close',
        'appearance.pickColor': 'Pick a colour',
        'appearance.accentNames': 'Tint category names',
        'appearance.categoryColorHint': 'Every category keeps its own accent — click the dot on a card to change it.',
        'list.workspaces': 'Workspaces',
        'list.search': 'Search chats…',
        'list.collapseAll': 'Collapse all',
        'list.addWorkspace': 'Add workspace',
        'list.manage': 'Manage categories',
        'list.newChat': 'New chat',
        'list.newChatAria': 'Start a new chat in "{name}"',
        'list.workspaceActions': 'Workspace actions for "{name}"',
        'list.renameWorkspace': 'Rename',
        'list.openDirectory': 'Open containing folder',
        'list.openDirectoryNoPath': 'This workspace has no recorded folder path',
        'list.openDirectoryUnsupported': 'This host cannot open local folders',
        'list.openDirectoryFailed': 'Could not open the folder: {message}',
        'list.openInVscode': 'Open in VS Code',
        'list.openInVscodeUnavailable': 'VS Code was not found on this host',
        'list.openInVscodeUnsupported': 'This host cannot launch VS Code',
        'list.openInVscodeFailed': 'Could not open in VS Code: {message}',
        'list.deleteWorkspace': 'Delete workspace',
        'list.deleteWorkspaceConfirm': 'Remove "{name}" from the workspace list? Files and sessions are kept.',
        'list.cancel': 'Cancel',
        'list.renameFailed': 'Could not rename: {message}',
        'list.deleteFailed': 'Could not delete: {message}',
        'list.uncategorized': 'Uncategorized',
        'list.empty': 'No workspaces yet',
        'list.noMatch': 'Nothing matches',
        'list.emptyCategory': 'Drag a workspace here',
        'list.showMore': 'Show {n} more',
        'list.archive': 'Archive',
        'list.archiveFailed': 'Could not archive: {message}',
        'list.untitled': 'Untitled',
        'list.noCategories': 'No categories yet — open Manage categories to create one.',
        'switcher.title': 'Recent chats',
        'switcher.hint': 'Recent chats: hold the modifier and tap Tab',
        'switcher.hold': 'Hold {mod} · tap Tab',
        'switcher.footer': 'Tab next · Shift+Tab previous · Esc cancel',
        'switcher.current': 'Current',
        'switcher.untitled': 'New chat',
        'switcher.running': 'Running',
        'time.now': 'now',
        'time.min': '{n}m',
        'time.hour': '{n}h',
        'time.day': '{n}d',
        'time.month': '{n}mo',
      },
      zh: {
        'panel.title': '工作区分类',
        'panel.subtitle': '把散落的工作区收进自定义分类。打开下面的开关，侧边栏列表就会按分类分组。',
        'panel.newCategory': '新建分类',
        'panel.searchPlaceholder': '搜索工作区…',
        'panel.count': '{n} 个工作区',
        'panel.sessions': '{n} 个会话',
        'panel.defaultName': '新分类',
        'panel.uncategorized': '未分类',
        'panel.uncategorizedHint': '把工作区拖到分类卡片上，或在它的菜单里选一个分类。',
        'panel.addWorkspace': '添加工作区…',
        'panel.remove': '移出分类',
        'panel.moveTo': '移到分类',
        'panel.rename': '重命名',
        'panel.delete': '删除分类',
        'panel.confirmDelete': '确认删除该分类？',
        'panel.cancel': '取消',
        'panel.open': '打开工作区',
        'panel.dropHere': '把工作区拖到这里',
        'panel.dragHint': '拖动行到分类卡片即可归类 · 单击一行直接打开该工作区',
        'panel.empty': '还没有工作区，先在侧边栏添加一个。',
        'panel.noMatch': '没有匹配的工作区。',
        'panel.loading': '正在读取工作区…',
        'panel.sidebarToggle': '侧边栏按分类分组',
        'panel.sidebarHint': '开启后左侧列表按分类分组（需要至少一个分类）；关闭则恢复 Harness 原生列表。',
        'panel.appearance': '外观',
        'panel.categoryColor': '分类颜色',
        'appearance.title': '外观设置',
        'appearance.tip': '字号、颜色和底色都会立即生效。',
        'appearance.fontSize': '字号',
        'appearance.color': '颜色',
        'appearance.background': '背景',
        'appearance.category': '分类',
        'appearance.workspace': '工作区',
        'appearance.session': '会话',
        'appearance.categoryBg': '分组底色',
        'appearance.cardBg': '卡片底色',
        'appearance.panelBg': '面板底色',
        'appearance.auto': '自动',
        'appearance.reset': '恢复默认',
        'appearance.close': '关闭',
        'appearance.pickColor': '选择颜色',
        'appearance.accentNames': '分类名用强调色',
        'appearance.categoryColorHint': '每个分类有自己的强调色：点卡片上的色点就能改。',
        'list.workspaces': '工作区',
        'list.search': '搜索会话…',
        'list.collapseAll': '全部收起',
        'list.addWorkspace': '添加工作区',
        'list.manage': '分类管理',
        'list.newChat': '新开对话',
        'list.newChatAria': '在「{name}」中新开对话',
        'list.workspaceActions': '工作区「{name}」的操作',
        'list.renameWorkspace': '重命名',
        'list.openDirectory': '打开所属目录',
        'list.openDirectoryNoPath': '这个工作区没有记录目录路径',
        'list.openDirectoryUnsupported': '当前宿主无法打开本地目录',
        'list.openDirectoryFailed': '打开目录失败：{message}',
        'list.openInVscode': '用 VS Code 打开',
        'list.openInVscodeUnavailable': '没有在当前宿主上找到 VS Code',
        'list.openInVscodeUnsupported': '当前宿主无法启动 VS Code',
        'list.openInVscodeFailed': '用 VS Code 打开失败：{message}',
        'list.deleteWorkspace': '删除工作区',
        'list.deleteWorkspaceConfirm': '将把「{name}」从工作区列表中移除。文件夹与会话记录会保留。',
        'list.cancel': '取消',
        'list.renameFailed': '重命名失败：{message}',
        'list.deleteFailed': '删除失败：{message}',
        'list.uncategorized': '未分类',
        'list.empty': '还没有工作区',
        'list.noMatch': '没有匹配项',
        'list.emptyCategory': '把工作区拖到这里',
        'list.showMore': '显示更多（{n}）',
        'list.archive': '归档',
        'list.archiveFailed': '归档失败：{message}',
        'list.untitled': '未命名',
        'list.noCategories': '还没有分类 —— 打开「分类管理」新建一个。',
        'switcher.title': '最近会话',
        'switcher.hint': '最近会话：按住修饰键连按 Tab',
        'switcher.hold': '按住 {mod} · 连按 Tab',
        'switcher.footer': 'Tab 下一个 · Shift+Tab 上一个 · Esc 取消',
        'switcher.current': '当前',
        'switcher.untitled': '新对话',
        'switcher.running': '正在运行',
        'time.now': '刚刚',
        'time.min': '{n} 分钟',
        'time.hour': '{n} 小时',
        'time.day': '{n} 天',
        'time.month': '{n} 个月',
      },
    };

    const FALLBACK = (typeof navigator !== 'undefined' && /^zh/i.test(navigator.language || ''))
      ? DICT.zh
      : DICT.en;

    function interpolate(text, vars) {
      if (!vars) return text;
      return String(text).replace(/\{(\w+)\}/g, (match, key) => (
        Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
      ));
    }

    /** `t` from the slot's locale face, with a local dictionary as a safety net. */
    function createTranslate(slotT) {
      return function t(key, vars) {
        let value;
        if (typeof slotT === 'function') {
          try { value = slotT(key, vars); } catch { value = undefined; }
        }
        if (typeof value !== 'string' || value === '' || value === key) {
          value = Object.prototype.hasOwnProperty.call(FALLBACK, key) ? FALLBACK[key] : key;
        }
        return interpolate(value, vars);
      };
    }

    // #region state

    function defaultState() {
      return {
        categories: [],
        assignments: {},
        sidebarGrouping: true,
        appearance: { ...APPEARANCE_DEFAULTS },
      };
    }

    function clampFontSize(value, fallback) {
      if (value === '' || value === null || value === undefined) return fallback;
      const size = Number(value);
      if (!Number.isFinite(size)) return fallback;
      return Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(size)));
    }

    /** Normalise `#rgb` / `#rrggbb` to `#rrggbb`; anything else means "theme". */
    function normalizeHex(value) {
      if (typeof value !== 'string') return '';
      const raw = value.trim();
      if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toUpperCase();
      if (/^#[0-9a-f]{3}$/i.test(raw)) {
        return ('#' + raw[1] + raw[1] + raw[2] + raw[2] + raw[3] + raw[3]).toUpperCase();
      }
      return '';
    }

    function withAlpha(hex, alpha) {
      const value = normalizeHex(hex);
      if (value === '') return '';
      const r = parseInt(value.slice(1, 3), 16);
      const g = parseInt(value.slice(3, 5), 16);
      const b = parseInt(value.slice(5, 7), 16);
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    function normalizeAppearance(raw) {
      const src = raw && typeof raw === 'object' ? raw : {};
      return {
        categoryFontSize: clampFontSize(src.categoryFontSize, APPEARANCE_DEFAULTS.categoryFontSize),
        workspaceFontSize: clampFontSize(src.workspaceFontSize, APPEARANCE_DEFAULTS.workspaceFontSize),
        sessionFontSize: clampFontSize(src.sessionFontSize, APPEARANCE_DEFAULTS.sessionFontSize),
        workspaceColor: normalizeHex(src.workspaceColor),
        sessionColor: normalizeHex(src.sessionColor),
        categoryBg: normalizeHex(src.categoryBg),
        cardBg: normalizeHex(src.cardBg),
        panelBg: normalizeHex(src.panelBg),
        accentNames: src.accentNames === true,
      };
    }

    /** CSS custom properties shared by the panel and the sidebar browser. */
    function appearanceVars(appearance) {
      const vars = {
        '--wsc-cat-size': appearance.categoryFontSize + 'px',
        '--wsc-ws-size': appearance.workspaceFontSize + 'px',
        '--wsc-session-size': appearance.sessionFontSize + 'px',
      };
      if (appearance.workspaceColor) vars['--wsc-ws-color'] = appearance.workspaceColor;
      if (appearance.sessionColor) vars['--wsc-session-color'] = appearance.sessionColor;
      if (appearance.categoryBg) vars['--wsc-cat-bg'] = appearance.categoryBg;
      if (appearance.cardBg) vars['--wsc-card-bg'] = appearance.cardBg;
      if (appearance.panelBg) vars['--wsc-panel-bg'] = appearance.panelBg;
      return vars;
    }

    /**
     * The category accent lives on the 3px bar (and the panel dot) instead of
     * washing the whole band: a tinted band reads as a highlighter over a
     * wallpaper or a frosted sidebar. The band itself stays neutral, and a
     * viewer-picked background simply replaces it.
     */
    function groupVars(color, appearance, loose) {
      const accent = normalizeHex(color) || ACCENTS[0];
      const vars = {
        '--wsc-cat-color': loose ? 'var(--dsw-alias-label-tertiary)' : accent,
        '--wsc-cat-tint': loose ? 'transparent' : withAlpha(accent, 0.07),
      };
      if (appearance.categoryBg) {
        vars['--wsc-cat-bg'] = appearance.categoryBg;
        vars['--wsc-cat-bg-hover'] = appearance.categoryBg;
      }
      return vars;
    }

    function normalize(parsed) {
      if (!parsed || typeof parsed !== 'object') return defaultState();
      const categories = Array.isArray(parsed.categories)
        ? parsed.categories
          .filter((row) => row && typeof row.id === 'string' && row.id !== '')
          .map((row, index) => ({
            id: row.id,
            name: typeof row.name === 'string' && row.name.trim() !== '' ? row.name : '—',
            color: normalizeHex(row.color) || ACCENTS[index % ACCENTS.length],
          }))
        : [];
      const ids = new Set(categories.map((row) => row.id));
      const assignments = {};
      if (parsed.assignments && typeof parsed.assignments === 'object') {
        for (const [workspaceId, categoryId] of Object.entries(parsed.assignments)) {
          if (typeof categoryId === 'string' && ids.has(categoryId)) assignments[workspaceId] = categoryId;
        }
      }
      return {
        categories,
        assignments,
        sidebarGrouping: parsed.sidebarGrouping !== false,
        appearance: normalizeAppearance(parsed.appearance),
      };
    }

    function readState() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_KEY);
        if (!raw) return defaultState();
        return normalize(JSON.parse(raw));
      } catch {
        return defaultState();
      }
    }

    function writeState(state) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage disabled: state still lives for this page session */
      }
    }

    function createStore() {
      let state = readState();
      const listeners = new Set();
      return {
        get: () => state,
        set(updater) {
          const next = typeof updater === 'function' ? updater(state) : updater;
          if (!next || next === state) return;
          state = next;
          writeState(state);
          for (const listener of Array.from(listeners)) listener();
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => { listeners.delete(listener); };
        },
      };
    }

    const store = createStore();

    function useStore() {
      return React.useSyncExternalStore(store.subscribe, store.get, store.get);
    }

    function newId() {
      return 'c' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
    }

    function baseName(path) {
      if (typeof path !== 'string') return '';
      const parts = path.split(/[\\/]/).filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : path;
    }

    function relativeTime(ts, t) {
      if (typeof ts !== 'number' || !Number.isFinite(ts)) return '';
      const minutes = Math.max(0, Math.floor((Date.now() - ts) / 60000));
      if (minutes < 1) return t('time.now');
      if (minutes < 60) return t('time.min', { n: minutes });
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return t('time.hour', { n: hours });
      const days = Math.floor(hours / 24);
      if (days < 30) return t('time.day', { n: days });
      return t('time.month', { n: Math.floor(days / 30) });
    }

    // #endregion

    // #region icons

    function svgAt(size, viewBox, children) {
      return h('svg', {
        width: size, height: size, viewBox, fill: 'none',
        'aria-hidden': true, style: { display: 'block', flex: 'none' },
      }, children);
    }

    function svg(size, children) {
      return svgAt(size, '0 0 24 24', children);
    }

    /** Native new-chat glyph; the local path is only a fallback for older hosts. */
    function NewChatIcon(size) {
      const edge = size || 16;
      const Native = primitives && primitives.IconNewChatOutlineRegular;
      if (typeof Native === 'function') return h(Native, { size: edge });
      return svgAt(edge, '0 0 16 16', [
        h('path', {
          key: 'bubble',
          d: 'M2.37091 11.2501C1.58745 9.89288 1.32067 8.29835 1.61969 6.76006C1.91872 5.22177 2.76342 3.8433 3.99826 2.87846C5.2331 1.91362 6.77494 1.42737 8.33988 1.50925C9.90482 1.59113 11.3875 2.23562 12.5149 3.32406C13.6425 4.41269 14.3387 5.87206 14.4754 7.4334C14.612 8.99474 14.18 10.5529 13.2587 11.8209C12.3375 13.0888 10.9891 13.9813 9.46194 14.3337C8.18691 14.628 6.85895 14.5294 5.64989 14.0605C5.1712 13.8748 4.76962 13.4932 4.26534 13.3967C3.67413 13.2835 2.95257 13.5598 2.03794 14.3337',
          stroke: 'currentColor', strokeWidth: 1,
        }),
        h('path', { key: 'v', d: 'M8 5V11', stroke: 'currentColor', strokeWidth: 1 }),
        h('path', { key: 'h', d: 'M5 8H11', stroke: 'currentColor', strokeWidth: 1 }),
      ]);
    }

    function FolderIcon(size) {
      return svg(size || 15, [
        h('path', {
          key: 'body',
          d: 'M3 7.6A2.6 2.6 0 0 1 5.6 5h3.1l1.7 2.1h8A2.6 2.6 0 0 1 21 9.7v6.7A2.6 2.6 0 0 1 18.4 19H5.6A2.6 2.6 0 0 1 3 16.4z',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round',
        }),
        h('path', { key: 'tab', d: 'M3.4 9.6h17.2', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
      ]);
    }

    /** Folder leaving for the Host desktop: "open this directory in Finder/Explorer". */
    function OpenExternalIcon(size) {
      return svg(size || 14, [
        h('path', {
          key: 'box',
          d: 'M18.6 13.6v3.8a2.1 2.1 0 0 1-2.1 2.1H5.7a2.1 2.1 0 0 1-2.1-2.1V6.7a2.1 2.1 0 0 1 2.1-2.1h3.8',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round',
        }),
        h('path', {
          key: 'arrow',
          d: 'M14.6 4.4h5v5M19.6 4.4l-7.4 7.4',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
      ]);
    }

    function PlusIcon(size) {
      return svg(size || 14, [
        h('path', { key: 'p', d: 'M12 5.5v13M5.5 12h13', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }),
      ]);
    }

    /** Editor glyph: a code file with the angle brackets of a source buffer. */
    function CodeIcon(size) {
      return svg(size || 14, [
        h('path', {
          key: 'file',
          d: 'M13.4 3.4H6.9a2 2 0 0 0-2 2v13.2a2 2 0 0 0 2 2h10.2a2 2 0 0 0 2-2V9.1z',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round',
        }),
        h('path', {
          key: 'fold',
          d: 'M13.4 3.4v5.7h5.7',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round',
        }),
        h('path', {
          key: 'brackets',
          d: 'M10.5 12.4L8.6 14.5l1.9 2.1M13.5 12.4l1.9 2.1-1.9 2.1',
          stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
      ]);
    }

    function PencilIcon(size) {
      return svg(size || 14, [
        h('path', {
          key: 'p',
          d: 'M4.5 19.5h3.2l9.4-9.4a2.1 2.1 0 0 0-3-3L4.7 16.5zM14.4 5.7l3 3',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round', strokeLinecap: 'round',
        }),
      ]);
    }

    function TrashIcon(size) {
      return svg(size || 14, [
        h('path', { key: 'l', d: 'M4.8 7.3h14.4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
        h('path', {
          key: 'b',
          d: 'M9.3 7.3V5.8c0-.7.6-1.3 1.3-1.3h2.8c.7 0 1.3.6 1.3 1.3v1.5M6.7 7.3l.8 10.4c.1.9.8 1.6 1.7 1.6h5.6c.9 0 1.6-.7 1.7-1.6l.8-10.4',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round', strokeLinecap: 'round',
        }),
      ]);
    }

    function CrossIcon(size) {
      return svg(size || 13, [
        h('path', { key: 'p', d: 'M6.5 6.5l11 11M17.5 6.5l-11 11', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
      ]);
    }

    function SearchIcon(size) {
      return svg(size || 14, [
        h('circle', { key: 'c', cx: 10.8, cy: 10.8, r: 5.6, stroke: 'currentColor', strokeWidth: 1.6 }),
        h('path', { key: 'l', d: 'M15 15l4.2 4.2', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
      ]);
    }

    function SlidersIcon(size) {
      return svg(size || 14, [
        h('path', { key: 'a', d: 'M5 8h14M5 16h14', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        h('circle', { key: 'b', cx: 9.5, cy: 8, r: 2.1, fill: 'var(--dsw-alias-bg-base)', stroke: 'currentColor', strokeWidth: 1.5 }),
        h('circle', { key: 'c', cx: 14.5, cy: 16, r: 2.1, fill: 'var(--dsw-alias-bg-base)', stroke: 'currentColor', strokeWidth: 1.5 }),
      ]);
    }

    function ChevronIcon(size) {
      return svg(size || 14, [
        h('path', {
          key: 'c',
          d: 'M9.5 6.8l4.9 5.2-4.9 5.2',
          stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
      ]);
    }

    /** Fold the whole list: two upward chevrons, the inverse of expanding a tree. */
    function CollapseAllIcon(size) {
      return svg(size || 16, [
        h('path', {
          key: 'top',
          d: 'M7 11L12 6l5 5',
          stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
        h('path', {
          key: 'bottom',
          d: 'M7 18L12 13l5 5',
          stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
      ]);
    }

    function PanelIcon({ size, active }) {
      const edge = typeof size === 'number' && size > 0 ? size : 18;
      return h('span', {
        style: {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: edge, height: edge,
          color: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor',
        },
      }, svg(edge, [
        h('path', {
          key: 'folder',
          d: 'M2.6 7.4A2.4 2.4 0 0 1 5 5h3l1.6 2h8.4A2.4 2.4 0 0 1 20.4 9.4v7A2.4 2.4 0 0 1 18 18.8H5a2.4 2.4 0 0 1-2.4-2.4z',
          stroke: 'currentColor', strokeWidth: 1.6, strokeLinejoin: 'round',
        }),
        h('path', { key: 'line', d: 'M2.9 9.6h18.2', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        h('circle', { key: 'dot1', cx: 7.2, cy: 13.6, r: 1.15, fill: 'currentColor' }),
        h('circle', { key: 'dot2', cx: 11, cy: 13.6, r: 1.15, fill: 'currentColor' }),
        h('circle', { key: 'dot3', cx: 14.8, cy: 13.6, r: 1.15, fill: 'currentColor' }),
      ]));
    }

    // #endregion

    const PANEL_CSS = `
.wsc-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--wsc-panel-bg,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font-family:inherit}
.wsc-head{padding:24px 32px 14px;display:flex;flex-direction:column;gap:14px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none}
.wsc-titlerow{display:flex;align-items:flex-start;gap:12px}
.wsc-title{margin:0;font-size:20px;line-height:28px;font-weight:600}
.wsc-sub{margin:2px 0 0;font-size:13px;line-height:19px;color:var(--dsw-alias-label-secondary)}
.wsc-grow{flex:1;min-width:0}
.wsc-chip{flex:none;font-size:12px;line-height:18px;padding:1px 8px;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);white-space:nowrap}
.wsc-kbd{border:none;font-family:inherit;font-variant-numeric:tabular-nums;letter-spacing:.01em;cursor:pointer}
.wsc-kbd:hover{background:var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary)}
.wsc-toolbar{display:flex;align-items:center;gap:8px}
.wsc-input{box-sizing:border-box;height:30px;border-radius:var(--dsw-radius-md);border:.5px solid var(--dsw-alias-border-l4);background:0 0;color:inherit;padding:0 8px;font-size:13px;line-height:18px;font-family:inherit;min-width:0}
.wsc-input::placeholder{color:var(--dsw-alias-label-tertiary)}
.wsc-input:focus{outline:none;border-color:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary))}
.wsc-search{width:240px;max-width:40%}
.wsc-btn{box-sizing:border-box;height:30px;padding:0 10px;border-radius:var(--dsw-radius-md);border:.5px solid var(--dsw-alias-border-l4);background:0 0;color:var(--dsw-alias-label-primary);font-size:13px;line-height:18px;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.wsc-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wsc-btn-primary{background:var(--dsw-alias-brand-primary);border-color:transparent;color:#fff}
.wsc-btn-primary:hover{background:var(--dsw-alias-brand-primary);filter:brightness(1.06)}
.wsc-btn-icon{width:28px;height:28px;padding:0;justify-content:center;border-color:transparent;color:var(--dsw-alias-label-secondary);border-radius:var(--dsw-radius-sm)}
.wsc-btn-icon:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.wsc-btn-danger{color:var(--dsw-alias-state-error-primary)}
.wsc-switch{display:inline-flex;align-items:center;gap:6px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);cursor:pointer;user-select:none;white-space:nowrap}
.wsc-switch input{accent-color:var(--dsw-alias-brand-primary);width:14px;height:14px;margin:0;cursor:pointer}
.wsc-body{flex:1;min-height:0;overflow:auto;padding:14px 32px 32px;display:flex;flex-direction:column;gap:10px}
.wsc-card{border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg,12px);background:var(--wsc-card-bg,var(--dsw-alias-bg-layer-1));overflow:hidden;flex:none}
.wsc-card-over{border-color:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary))}
.wsc-cardhead{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--wsc-cat-bg,var(--wsc-cat-tint,transparent))}
.wsc-catdot{position:relative;width:14px;height:14px;flex:none;border-radius:50%;overflow:hidden;cursor:pointer;border:.5px solid var(--dsw-alias-border-l3,var(--dsw-alias-border-l4));background:0 0}
.wsc-catdot input{position:absolute;inset:-6px;width:26px;height:26px;opacity:0;cursor:pointer;border:none;padding:0}
.wsc-catdot span{position:absolute;inset:0;pointer-events:none;background:var(--wsc-cat-color,var(--dsw-alias-label-tertiary))}
.wsc-catdot:hover{box-shadow:0 0 0 3px var(--dsw-alias-interactive-bg-hover)}
.wsc-name{max-width:46ch;margin:0;padding:2px 4px;border:none;border-radius:var(--dsw-radius-sm);background:0 0;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:var(--wsc-cat-size,14px);line-height:1.35;font-weight:600;cursor:text;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wsc-accent .wsc-name{color:var(--wsc-cat-color,inherit)}
.wsc-name:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wsc-count{flex:none;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}
.wsc-rows{display:flex;flex-direction:column}
.wsc-row{display:flex;align-items:center;gap:8px;min-height:34px;padding:4px 8px 4px 12px;cursor:pointer;border-top:1px solid var(--dsw-alias-border-l1);outline:none}
.wsc-row:first-child{border-top:none}
.wsc-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wsc-row:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary));outline-offset:-2px}
.wsc-row-drag{opacity:.45}
.wsc-rowtitle{font-size:var(--wsc-ws-size,14px);line-height:20px;font-weight:500;color:var(--wsc-ws-color,var(--dsw-alias-label-primary));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wsc-path{font-size:12px;line-height:17px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wsc-actions{display:flex;align-items:center;gap:4px;opacity:0;transition:opacity .12s;flex:none}
.wsc-row:hover .wsc-actions,.wsc-actions:focus-within,.wsc-actions-on{opacity:1}
.wsc-empty{padding:10px 12px 12px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.wsc-foot{display:flex;align-items:center;gap:8px;padding:6px 12px 8px}
.wsc-select{max-width:240px;height:26px;padding:0 4px;border-radius:var(--dsw-radius-sm);border:.5px solid var(--dsw-alias-border-l4);background:0 0;color:var(--dsw-alias-label-primary);font-size:12px;font-family:inherit;cursor:pointer}
.wsc-select:focus{outline:none;border-color:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary))}
.wsc-hint{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);padding:0 2px}
.wsc-note{padding:12px;font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-secondary);border:1px dashed var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-lg,12px)}
.wsc-btn-on{background:var(--dsw-alias-interactive-bg-hover)}
.wsc-appear{border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-alias-bg-layer-1);padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px;flex:none}
.wsc-appearhead{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.wsc-appeartitle{font-size:14px;line-height:20px;font-weight:600}
.wsc-appeartip{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.wsc-appeartip-foot{margin:2px 0 0;padding:0 2px}
.wsc-appearcols{display:grid;grid-template-columns:repeat(auto-fit,minmax(232px,1fr));gap:6px 26px;align-items:start}
.wsc-appearcol{display:flex;flex-direction:column;gap:2px;min-width:0}
.wsc-appeargroup{font-size:11px;line-height:16px;font-weight:600;letter-spacing:.02em;color:var(--dsw-alias-label-tertiary);margin:2px 0 4px;text-transform:uppercase}
@supports (color: color-mix(in srgb, red, blue)){.wsc-accent .wsc-name{color:color-mix(in srgb,var(--wsc-cat-color,currentColor) 86%,var(--dsw-alias-label-primary))}}
.wsc-appearrow{display:flex;align-items:center;gap:8px;min-height:32px}
.wsc-appearname{flex:none;width:64px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.wsc-range{flex:1;min-width:80px;max-width:180px;height:16px;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}
.wsc-unit{flex:none;width:38px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}
.wsc-swatchwrap{position:relative;display:inline-flex;width:28px;height:24px;flex:none;border-radius:var(--dsw-radius-sm);overflow:hidden;border:.5px solid var(--dsw-alias-border-l4);cursor:pointer}
.wsc-swatchwrap input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;padding:0}
.wsc-swatch{position:absolute;inset:0;pointer-events:none;background:var(--dsw-alias-bg-base)}
.wsc-swatch-auto{background:repeating-linear-gradient(45deg,var(--dsw-alias-border-l3,var(--dsw-alias-border-l4)) 0 2px,transparent 2px 5px)}
.wsc-mini{flex:none;height:24px;padding:0 8px;border-radius:var(--dsw-radius-sm);border:.5px solid var(--dsw-alias-border-l4);background:0 0;color:var(--dsw-alias-label-secondary);font-family:inherit;font-size:12px;line-height:16px;cursor:pointer}
.wsc-mini:hover:enabled{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.wsc-mini:disabled{opacity:.4;cursor:default}
.wsc-appearswitch{min-height:30px;margin:2px 0 0;padding-left:2px}
`;

    const LIST_CSS = `
.wscb-root{box-sizing:border-box;display:flex;flex-direction:column;flex:1;min-height:0;padding-right:var(--dsh-session-list-edge-inset,12px);color:var(--dsw-alias-label-primary);font-family:inherit}
.wscb-sectionheader{box-sizing:border-box;display:flex;align-items:center;gap:4px;height:36px;flex:none;margin:2px -4px 4px 0;padding-left:4px;color:var(--dsw-alias-label-tertiary);border-radius:var(--dsw-radius-md);overflow:hidden}
.wscb-sectionlabel{flex:none;min-width:0;max-width:45%;font-size:12px;line-height:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wscb-searchslot{display:flex;align-items:center;justify-content:flex-end;flex:1;min-width:0;padding-left:4px}
.wscb-searchbox{box-sizing:border-box;width:100%;height:28px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);background:0 0;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:18px;padding:0 8px;outline:none}
.wscb-searchbox::placeholder{color:var(--dsw-alias-label-tertiary)}
.wscb-actions{display:flex;align-items:center;gap:4px;flex:none}
.wscb-iconbtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;flex:none;padding:0;border:none;background:0 0;border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-secondary);cursor:pointer}
.wscb-iconbtn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wscb-iconbtn:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.wscb-notice{margin:0 0 6px;padding:6px 8px;font-size:11px;line-height:16px;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover);border-radius:var(--dsw-radius-sm)}
.wscb-listarea{display:flex;flex-direction:column;flex:1;min-height:0;margin-left:-4px;margin-right:calc(-1 * var(--dsh-session-list-edge-inset,12px));padding-left:4px}
.wscb-list{flex:1;min-height:0;overflow-y:auto;scrollbar-gutter:stable;margin-left:-4px;margin-right:2px;padding-left:4px;padding-right:calc(var(--dsh-session-list-edge-inset,12px) - 7px);padding-bottom:16px}
.wscb-group{position:relative}
.wscb-group+.wscb-group{margin-top:10px}
.wscb-grouphead{box-sizing:border-box;display:flex;align-items:center;gap:6px;width:100%;height:32px;padding:0 8px 0 2px;border:none;background:var(--wsc-cat-bg,transparent);border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:var(--wsc-cat-size,14px);line-height:1.3;font-weight:600;text-align:left;cursor:pointer}
@supports (background: color-mix(in srgb, red, blue)){.wscb-grouphead{background:var(--wsc-cat-bg,color-mix(in srgb,var(--dsw-alias-interactive-bg-hover) 100%,transparent))}}
.wscb-grouphead:hover{background:var(--wsc-cat-bg-hover,var(--dsw-alias-interactive-bg-hover))}
.wsc-accent .wscb-grouphead{color:var(--wsc-cat-color,inherit)}
.wscb-gchev{display:inline-flex;align-items:center;justify-content:center;width:16px;flex:none;transition:transform .15s var(--ds-ease-in-out);opacity:.75}
.wscb-gname{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@supports (color: color-mix(in srgb, red, blue)){.wsc-accent .wscb-grouphead{color:color-mix(in srgb,var(--wsc-cat-color,currentColor) 86%,var(--dsw-alias-label-primary))}}
.wscb-gcount{flex:none;font-size:11px;line-height:16px;font-weight:400;color:var(--dsw-alias-label-secondary)}
.wscb-rows>*+*{margin-top:2px}
.wscb-projectgroup{position:relative}
.wscb-projectrow{box-sizing:border-box;display:flex;align-items:center;gap:6px;height:34px;padding:0 8px;border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;outline:none}
.wscb-projectrow:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wscb-projectrow:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.wscb-lead{display:inline-flex;align-items:center;justify-content:center;width:16px;height:20px;flex:none;color:var(--dsw-alias-label-tertiary);border-radius:4px;cursor:pointer}
.wscb-lead:hover{color:var(--dsw-alias-label-primary)}
.wscb-folder{display:inline-flex}
.wscb-chevron{display:none;transition:transform .15s var(--ds-ease-in-out)}
.wscb-projectrow:hover .wscb-chevron{display:inline-flex}
.wscb-projectrow:hover .wscb-folder{display:none}
.wscb-title{flex:1;min-width:0;font-size:var(--wsc-ws-size,14px);line-height:20px;font-weight:400;color:var(--wsc-ws-color,var(--dsw-alias-label-primary));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wscb-count{flex:none;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.wscb-sessionrow{box-sizing:border-box;display:flex;align-items:center;height:32px;padding:0 8px 0 26px;border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;outline:none;position:relative}
.wscb-sessionrow::before{content:"";position:absolute;left:15px;top:-2px;bottom:-2px;width:1px;background:var(--dsw-alias-border-l2,var(--dsw-alias-border-l1));opacity:.7}
.wscb-sessionrow:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wscb-sessionrow:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.wscb-sessionrow .wscb-title{flex:1;margin:0 6px 0 4px;font-size:var(--wsc-session-size,13px);color:var(--wsc-session-color,var(--dsw-alias-label-secondary))}
.wscb-slot{display:inline-flex;align-items:center;justify-content:center;width:16px;height:20px;flex:none;color:var(--dsw-alias-label-tertiary)}
.wscb-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary))}
.wscb-time{flex:none;font-size:10px;line-height:16px;color:var(--dsw-alias-label-tertiary)}
.wscb-rowactions{display:none;flex:none;align-items:center;gap:6px}
.wscb-sessionrow:hover .wscb-time{display:none}
.wscb-sessionrow:hover .wscb-rowactions{display:inline-flex}
.wscb-icon-sm{width:20px;height:20px}
.wscb-projectactions{display:none;flex:none;align-items:center;gap:15px}
.wscb-projectrow:hover .wscb-projectactions,.wscb-projectrow:focus-within .wscb-projectactions,.wscb-projectrow.wscb-menuopen .wscb-projectactions{display:inline-flex}
.wscb-projectrow:hover .wscb-count,.wscb-projectrow.wscb-menuopen .wscb-count{display:none}
.wscb-iconaction{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;flex:none;padding:0;border:none;background:0 0;border-radius:var(--dsw-radius-xs);color:var(--dsw-alias-label-tertiary);cursor:pointer}
.wscb-iconaction:hover{color:var(--dsw-alias-label-primary)}
.wscb-iconaction:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:0}
.wscb-renameinput{box-sizing:border-box;flex:1;min-width:0;height:24px;padding:0 4px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-button-elevated-fill);color:inherit;font-family:inherit;font-size:14px;line-height:20px;outline:none}
.wscb-confirm{margin:2px 0 4px 26px;padding:6px 8px;display:flex;flex-direction:column;gap:6px;border:1px dashed var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm)}
.wscb-confirmtext{font-size:12px;line-height:17px;color:var(--dsw-alias-label-secondary)}
.wscb-confirmactions{display:flex;gap:6px;justify-content:flex-end}
.wscb-confirmbtn{height:24px;padding:0 8px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm);background:0 0;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:12px;line-height:16px;cursor:pointer}
.wscb-confirmbtn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wscb-confirmdanger{color:var(--dsw-alias-state-error-primary)}
.wscb-more{display:block;height:28px;margin-left:26px;padding:0 8px;border:none;background:0 0;border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-tertiary);font-family:inherit;font-size:12px;line-height:18px;text-align:left;cursor:pointer}
.wscb-more:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.wscb-empty{margin:0 0 2px 26px;padding:4px 8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);border:1px dashed var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm)}
.wscb-hint{margin:2px 8px 6px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.wscb-drop{box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary));border-radius:var(--dsw-radius-md)}
`;

    // #region recent conversations switcher

    /**
     * Conversation recency, stored next to the grouping preference in the page's
     * localStorage. `Ctrl+Tab` walks it the way an editor walks its open tabs:
     * hold the modifier, tap Tab to move the highlight, release to land on it.
     * Only ids are kept here — titles, workspaces and timestamps are always read
     * back from the shipped Session catalog, so a rename or a new turn shows up
     * without any extra bookkeeping.
     */
    const MRU_KEY = 'dsh.workspace-categories.mru.v1';
    const MRU_LIMIT = 12;

    function readMru() {
      try {
        const raw = window.localStorage.getItem(MRU_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((id) => typeof id === 'string' && id !== '').slice(0, MRU_LIMIT);
      } catch {
        return [];
      }
    }

    function createMru() {
      let ids = readMru();
      const listeners = new Set();
      const commit = () => {
        try { window.localStorage.setItem(MRU_KEY, JSON.stringify(ids)); } catch { /* page-only order */ }
        for (const listener of Array.from(listeners)) listener();
      };
      return {
        get: () => ids,
        subscribe(listener) {
          listeners.add(listener);
          return () => { listeners.delete(listener); };
        },
        /** Front the conversation the viewer just landed on. */
        touch(id) {
          if (typeof id !== 'string' || id === '') return;
          const next = [id].concat(ids.filter((value) => value !== id)).slice(0, MRU_LIMIT);
          if (next.length === ids.length && next.every((value, index) => value === ids[index])) return;
          ids = next;
          commit();
        },
        /**
         * Append conversations this page has not seen yet, most recently active
         * first. A viewer who never clicked a chat still gets a useful list, and
         * the order of what they did open is never disturbed.
         */
        merge(list) {
          if (!Array.isArray(list) || list.length === 0) return;
          const known = new Set(ids);
          const extra = list.filter((id) => !known.has(id));
          if (extra.length === 0) return;
          ids = ids.concat(extra).slice(0, MRU_LIMIT);
          commit();
        },
      };
    }

    const mru = createMru();

    /**
     * Overlay state: closed, or an open list with one highlighted row.
     *
     * `getSnapshot` is the shape the slot renderer binds a `hooks` source to —
     * it calls `source.getSnapshot()` and `source.subscribe()`. Without that
     * exact method the projected `useSwitcher` hook throws while rendering and
     * the card silently never appears, so both names are exposed.
     */
    function createSwitcherState() {
      let state = { open: false, rows: [], index: 0, currentId: null };
      const listeners = new Set();
      const get = () => state;
      return {
        get,
        getSnapshot: get,
        subscribe(listener) {
          listeners.add(listener);
          return () => { listeners.delete(listener); };
        },
        set(next) {
          state = next;
          for (const listener of Array.from(listeners)) listener();
        },
      };
    }

    const switcher = createSwitcherState();
    const CLOSED_SWITCHER = { open: false, rows: [], index: 0, currentId: null };

    const SWITCH_CSS = `
.wscs-scrim{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.16);animation:wscs-fade .1s ease-out}
.wscs-card{box-sizing:border-box;display:flex;flex-direction:column;width:440px;max-width:100%;max-height:100%;border-radius:14px;border:.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-1,var(--dsw-alias-bg-base));color:var(--dsw-alias-label-primary);font-family:inherit;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.3),0 2px 8px rgba(0,0,0,.16);animation:wscs-rise .12s ease-out}
.wscs-head{display:flex;align-items:baseline;gap:8px;flex:none;padding:12px 14px 10px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.wscs-headtitle{font-size:13px;line-height:18px;font-weight:600}
.wscs-hint{margin-left:auto;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}
.wscs-list{flex:1;min-height:0;overflow-y:auto;padding:6px;scrollbar-gutter:stable}
.wscs-row{box-sizing:border-box;position:relative;display:flex;align-items:center;gap:10px;min-height:46px;padding:6px 10px 6px 13px;border-radius:9px;cursor:pointer;user-select:none}
.wscs-row-on{background:var(--dsw-alias-interactive-bg-hover)}
.wscs-row-on:before{content:"";position:absolute;left:4px;top:9px;bottom:9px;width:2px;border-radius:2px;background:var(--dsw-alias-brand-primary)}
.wscs-mark{display:inline-flex;flex:none;width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--dsw-alias-border-l4)}
.wscs-mark-run{background:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary));box-shadow:none}
.wscs-body{display:flex;flex-direction:column;gap:1px;flex:1;min-width:0}
.wscs-title{font-size:13.5px;line-height:19px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wscs-meta{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wscs-badge{flex:none;font-size:10px;line-height:16px;padding:0 6px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l4);color:var(--dsw-alias-label-secondary)}
.wscs-foot{flex:none;padding:7px 14px 9px;border-top:1px solid var(--dsw-alias-border-l1);font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}
@keyframes wscs-fade{from{opacity:0}to{opacity:1}}
@keyframes wscs-rise{from{opacity:0;transform:translateY(-4px) scale(.99)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.wscs-scrim,.wscs-card{animation:none}}
`;

    /**
     * Owns recency tracking, the hold-modifier interaction, and the handoff to
     * the shipped workspace service. Reads go through the Session and Workspace
     * snapshots the app already keeps, so nothing is duplicated here.
     */
    function createRecentSwitcher(options) {
      const { sessions, workspaces, openSession, showConversation, t } = options;
      let lastActive = null;

      const sessionSnapshot = () => {
        try { return sessions.list.getSnapshot(); } catch { return null; }
      };
      const workspaceSnapshot = () => {
        try { return workspaces.list.getSnapshot(); } catch { return null; }
      };
      const workspaceItems = () => {
        const snapshot = workspaceSnapshot();
        return snapshot && Array.isArray(snapshot.items) ? snapshot.items : [];
      };
      const archivedIds = () => {
        const snapshot = workspaceSnapshot();
        return new Set((snapshot && snapshot.archivedSessionIds) || []);
      };
      const workspaceNameOf = (sessionId) => {
        for (const row of workspaceItems()) {
          if ((row.sessionIds || []).indexOf(sessionId) >= 0) {
            return row.title && row.title !== '' ? row.title : baseName(row.path);
          }
        }
        return '';
      };
      /**
       * The conversations the sidebar would show: only ids that belong to a
       * workspace. The catalog also carries subagent-origin sessions and other
       * rows with no main view of their own — switching to one of those lands on
       * a view that never finishes loading, so they stay out of the list.
       * `null` means the workspace snapshot is not ready yet; then nothing is
       * filtered rather than hiding every row.
       */
      const memberIds = () => {
        const items = workspaceItems();
        if (items.length === 0) return null;
        const ids = new Set();
        for (const row of items) {
          for (const id of row.sessionIds || []) ids.add(id);
        }
        return ids;
      };
      /** The conversation the main view is currently showing, if any. */
      const activeSessionId = () => {
        const snapshot = sessionSnapshot();
        const byId = (snapshot && snapshot.byId) || {};
        for (const id of Object.keys(byId)) {
          const summary = byId[id];
          if (summary && summary.retainedBy && summary.retainedBy.mainView > 0) return id;
        }
        return null;
      };

      const buildRows = () => {
        const snapshot = sessionSnapshot();
        const byId = (snapshot && snapshot.byId) || {};
        const archived = archivedIds();
        const members = memberIds();
        const rows = [];
        for (const id of mru.get()) {
          const summary = byId[id];
          if (!summary || archived.has(id)) continue;
          if (members !== null && !members.has(id)) continue;
          const title = summary.title && String(summary.title).trim() !== ''
            ? summary.title
            : t('switcher.untitled');
          rows.push({
            id,
            title,
            workspace: workspaceNameOf(id),
            time: relativeTime(summary.updatedAt, t),
            running: summary.running === true,
          });
        }
        return rows;
      };

      const close = () => {
        if (switcher.get().open) switcher.set({ open: false, rows: [], index: 0, currentId: null });
      };

      const move = (delta) => {
        const state = switcher.get();
        if (!state.open || state.rows.length === 0) return;
        const index = (state.index + delta + state.rows.length) % state.rows.length;
        if (index === state.index) return;
        switcher.set({ ...state, index });
      };

      const focusRow = (index) => {
        const state = switcher.get();
        if (!state.open || index < 0 || index >= state.rows.length || index === state.index) return;
        switcher.set({ ...state, index });
      };

      const activate = (id) => {
        if (typeof id !== 'string' || id === '') return;
        // The card may have been open while the catalog changed under it.
        const snapshot = sessionSnapshot();
        const byId = (snapshot && snapshot.byId) || {};
        if (!byId[id]) return;
        mru.touch(id);
        try { showConversation(); } catch { /* ignore */ }
        try {
          const pending = openSession(id);
          if (pending && typeof pending.catch === 'function') pending.catch(() => {});
        } catch { /* ignore */ }
      };

      /**
       * Open on the neighbour of the current conversation, matching the editor
       * habit: the first Tab previews the previous chat, `Shift+Tab` the other
       * direction. Nothing opens when there is no other conversation to reach.
       */
      const open = (backwards) => {
        const rows = buildRows();
        if (rows.length < 2) return false;
        const current = activeSessionId();
        const at = rows.findIndex((row) => row.id === current);
        const anchor = at >= 0 ? at : 0;
        const index = backwards
          ? (anchor - 1 + rows.length) % rows.length
          : (anchor + 1) % rows.length;
        switcher.set({ open: true, rows, index, currentId: current });
        return true;
      };

      const commit = () => {
        const state = switcher.get();
        if (!state.open) return;
        const row = state.rows[state.index];
        close();
        if (row) activate(row.id);
      };

      const choose = (id) => {
        const state = switcher.get();
        if (!state.open) return;
        const row = state.rows.find((item) => item.id === id);
        close();
        if (row) activate(row.id);
      };

      const cancel = () => close();

      /** Follow the main view so the list always starts from what is on screen. */
      const sync = () => {
        const active = activeSessionId();
        if (active !== null && active !== lastActive) {
          lastActive = active;
          mru.touch(active);
        }
        if (mru.get().length < MRU_LIMIT) {
          const snapshot = sessionSnapshot();
          const byId = (snapshot && snapshot.byId) || {};
          const ids = (snapshot && Array.isArray(snapshot.ids)) ? snapshot.ids : Object.keys(byId);
          const archived = archivedIds();
          const members = memberIds();
          const recent = ids
            .filter((id) => byId[id] && byId[id].blank !== true && !archived.has(id))
            .filter((id) => members === null || members.has(id))
            .sort((a, b) => (byId[b].updatedAt || 0) - (byId[a].updatedAt || 0));
          mru.merge(recent);
        }
      };

      const detach = sessions.list.subscribe(sync);
      sync();

      /**
       * Capture phase, so the overlay owns Tab before the composer, the editor
       * or the shipped shortcut dispatcher sees it. Only `Ctrl+Tab` is claimed:
       * plain Tab, `Cmd+Tab` (the system switcher) and every other chord pass
       * through untouched.
       */
      const onKeyDown = (event) => {
        if (event.altKey || event.metaKey) return;
        if (event.key === 'Tab') {
          const isOpen = switcher.get().open;
          // Plain Tab outside the switcher keeps moving focus as usual.
          if (!isOpen && !event.ctrlKey) return;
          event.preventDefault();
          event.stopPropagation();
          if (!isOpen) {
            open(event.shiftKey === true);
            return;
          }
          move(event.shiftKey ? -1 : 1);
          return;
        }
        if (!switcher.get().open) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          cancel();
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          commit();
          return;
        }
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
          event.preventDefault();
          event.stopPropagation();
          move(1);
          return;
        }
        if (event.key === 'ArrowUp' || event.key === 'PageUp') {
          event.preventDefault();
          event.stopPropagation();
          move(-1);
        }
      };

      /** Releasing the modifier is the commit gesture, exactly like an editor. */
      const onKeyUp = (event) => {
        if (!switcher.get().open) return;
        if (event.key === 'Control' || event.key === 'Meta') commit();
      };

      /** Losing the window (another app, a system dialog) drops the pending switch. */
      const onBlur = () => {
        if (switcher.get().open) close();
      };

      window.addEventListener('keydown', onKeyDown, true);
      window.addEventListener('keyup', onKeyUp, true);
      window.addEventListener('blur', onBlur);

      return {
        choose,
        focusRow,
        cancel,
        /** Open from the panel header, for viewers who would rather click. */
        toggle() {
          if (switcher.get().open) close();
          else open(false);
        },
        dispose() {
          close();
          detach();
          window.removeEventListener('keydown', onKeyDown, true);
          window.removeEventListener('keyup', onKeyUp, true);
          window.removeEventListener('blur', onBlur);
        },
      };
    }

    /** The `shell.overlay` entry: one HUD card, nothing while it is closed. */
    function RecentSwitcherOverlay(props) {
      const t = React.useMemo(() => createTranslate(props.t), [props.t]);
      const state = (typeof props.useSwitcher === 'function'
        ? props.useSwitcher((value) => value)
        : null) || CLOSED_SWITCHER;
      const listRef = React.useRef(null);
      // A long list keeps the highlight visible while the modifier is held.
      React.useEffect(() => {
        const list = listRef.current;
        if (!list || typeof list.querySelector !== 'function') return;
        const active = list.querySelector('[data-active="true"]');
        if (active && typeof active.scrollIntoView === 'function') {
          active.scrollIntoView({ block: 'nearest' });
        }
      }, [state.open, state.index]);
      if (!state.open || state.rows.length === 0) return null;
      const mod = IS_MAC ? 'Control' : 'Ctrl';
      return h('div', {
        className: 'wscs-scrim',
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) props.cancel();
        },
      },
        h('style', { key: 'css' }, SWITCH_CSS),
        h('div', {
          className: 'wscs-card',
          role: 'dialog',
          'aria-label': t('switcher.title'),
        },
          h('div', { className: 'wscs-head' },
            h('span', { className: 'wscs-headtitle' }, t('switcher.title')),
            h('span', { className: 'wscs-hint' }, t('switcher.hold', { mod })),
          ),
          h('div', { className: 'wscs-list', role: 'listbox', ref: listRef },
            state.rows.map((row, index) => h('div', {
              key: row.id,
              role: 'option',
              'aria-selected': index === state.index,
              'data-active': index === state.index ? 'true' : undefined,
              className: 'wscs-row' + (index === state.index ? ' wscs-row-on' : ''),
              onMouseEnter: () => props.focusRow(index),
              onMouseDown: (event) => {
                event.preventDefault();
                event.stopPropagation();
                props.choose(row.id);
              },
            },
              h('span', {
                className: 'wscs-mark' + (row.running ? ' wscs-mark-run' : ''),
                title: row.running ? t('switcher.running') : undefined,
              }),
              h('span', { className: 'wscs-body' },
                h('span', { className: 'wscs-title' }, row.title),
                h('span', { className: 'wscs-meta' },
                  [row.workspace, row.time].filter((value) => value !== '').join(' · ')),
              ),
              row.id === state.currentId
                ? h('span', { className: 'wscs-badge' }, t('switcher.current'))
                : null,
            )),
          ),
          h('div', { className: 'wscs-foot' }, t('switcher.footer')),
        ),
      );
    }

    // #endregion

    // #region category panel

    function createPanel(services, showSwitcherHint, onOpenSwitcher) {
      return function WorkspaceCategoriesPanel(props) {
        const t = React.useMemo(() => createTranslate(props.t), [props.t]);
        const useWorkspaces = props.useWorkspaces;
        const snapshot = typeof useWorkspaces === 'function' ? useWorkspaces((state) => state) : null;
        const items = (snapshot && Array.isArray(snapshot.items)) ? snapshot.items : [];
        const loading = snapshot === null || snapshot === undefined
          || (snapshot.phase !== 'ready' && items.length === 0);

        const state = useStore();
        const appearance = state.appearance || APPEARANCE_DEFAULTS;
        const [query, setQuery] = React.useState('');
        const [editing, setEditing] = React.useState(null);
        const [dragId, setDragId] = React.useState(null);
        const [dropCat, setDropCat] = React.useState(null);
        const [confirmId, setConfirmId] = React.useState(null);
        const [showAppearance, setShowAppearance] = React.useState(false);

        const categories = state.categories;
        const categoryIds = React.useMemo(() => new Set(categories.map((row) => row.id)), [categories]);

        const patchAppearance = (patch) => {
          store.set((prev) => ({
            ...prev,
            appearance: normalizeAppearance({ ...(prev.appearance || APPEARANCE_DEFAULTS), ...patch }),
          }));
        };

        const resetAppearance = () => {
          store.set((prev) => ({ ...prev, appearance: { ...APPEARANCE_DEFAULTS } }));
        };

        const setCategoryColor = (id, color) => {
          const next = normalizeHex(color);
          if (next === '') return;
          store.set((prev) => ({
            ...prev,
            categories: prev.categories.map((row) => (row.id === id ? { ...row, color: next } : row)),
          }));
        };

        const assign = (workspaceId, categoryId) => {
          store.set((prev) => {
            const assignments = { ...prev.assignments };
            if (categoryId === null || categoryId === undefined || !prev.categories.some((row) => row.id === categoryId)) {
              delete assignments[workspaceId];
            } else {
              assignments[workspaceId] = categoryId;
            }
            return { ...prev, assignments };
          });
        };

        const addCategory = () => {
          const id = newId();
          const name = t('panel.defaultName');
          store.set((prev) => ({
            ...prev,
            categories: [...prev.categories, { id, name, color: ACCENTS[prev.categories.length % ACCENTS.length] }],
          }));
          setEditing({ id, draft: name });
        };

        const commitRename = () => {
          if (editing === null) return;
          const draft = editing.draft.trim();
          const target = editing.id;
          if (draft !== '') {
            store.set((prev) => ({
              ...prev,
              categories: prev.categories.map((row) => (row.id === target ? { ...row, name: draft } : row)),
            }));
          }
          setEditing(null);
        };

        const removeCategory = (id) => {
          store.set((prev) => {
            const assignments = { ...prev.assignments };
            for (const [workspaceId, categoryId] of Object.entries(assignments)) {
              if (categoryId === id) delete assignments[workspaceId];
            }
            return { ...prev, categories: prev.categories.filter((row) => row.id !== id), assignments };
          });
        };

        const openWorkspace = (workspaceId) => {
          try { services.showConversation(); } catch { /* layout unavailable */ }
          try {
            const pending = services.openWorkspace(workspaceId);
            if (pending && typeof pending.catch === 'function') pending.catch(() => {});
          } catch { /* navigation refused */ }
        };

        const trimmedQuery = query.trim().toLowerCase();
        const matches = (row) => {
          if (trimmedQuery === '') return true;
          return String(row.title || '').toLowerCase().includes(trimmedQuery)
            || String(row.path || '').toLowerCase().includes(trimmedQuery);
        };

        const nameOf = (row) => (row.title && row.title !== '' ? row.title : baseName(row.path));

        const groups = categories.map((category) => ({
          category,
          rows: items.filter((row) => state.assignments[row.workspaceId] === category.id).filter(matches),
        }));
        const loose = items
          .filter((row) => !categoryIds.has(state.assignments[row.workspaceId]))
          .filter(matches);
        const visibleGroups = trimmedQuery === '' ? groups : groups.filter((group) => group.rows.length > 0);
        const totalVisible = visibleGroups.reduce((sum, group) => sum + group.rows.length, 0) + loose.length;
        const unassignedOptions = items.filter((row) => !categoryIds.has(state.assignments[row.workspaceId]));

        const renderRow = (row, category) => {
          const assigned = category !== null;
          return h('div', {
            key: row.workspaceId,
            className: 'wsc-row' + (dragId === row.workspaceId ? ' wsc-row-drag' : ''),
            role: 'button',
            tabIndex: 0,
            draggable: true,
            title: t('panel.open') + (row.path ? ' · ' + row.path : ''),
            onDragStart: (event) => {
              setDragId(row.workspaceId);
              try {
                event.dataTransfer.setData('text/plain', row.workspaceId);
                event.dataTransfer.effectAllowed = 'move';
              } catch { /* older engines */ }
            },
            onDragEnd: () => { setDragId(null); setDropCat(null); },
            onClick: () => openWorkspace(row.workspaceId),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openWorkspace(row.workspaceId);
              }
            },
          },
            h('span', { style: { color: 'var(--dsw-alias-label-secondary)', display: 'inline-flex' } }, FolderIcon(15)),
            h('div', { className: 'wsc-grow' },
              h('div', { className: 'wsc-rowtitle' }, nameOf(row)),
              h('div', { className: 'wsc-path' }, row.path || ''),
            ),
            h('span', { className: 'wsc-count' }, t('panel.sessions', { n: (row.sessionIds || []).length })),
            h('div', { className: 'wsc-actions' + (assigned ? '' : ' wsc-actions-on') },
              h('select', {
                className: 'wsc-select',
                value: assigned ? category.id : '',
                title: t('panel.moveTo'),
                'aria-label': t('panel.moveTo'),
                onClick: (event) => event.stopPropagation(),
                onKeyDown: (event) => event.stopPropagation(),
                onChange: (event) => {
                  event.stopPropagation();
                  assign(row.workspaceId, event.target.value === '' ? null : event.target.value);
                },
              },
                h('option', { value: '' }, t('panel.uncategorized')),
                categories.map((entry) => h('option', { key: entry.id, value: entry.id }, entry.name)),
              ),
              assigned ? h('button', {
                type: 'button',
                className: 'wsc-btn wsc-btn-icon',
                title: t('panel.remove'),
                'aria-label': t('panel.remove'),
                onClick: (event) => {
                  event.stopPropagation();
                  assign(row.workspaceId, null);
                },
              }, CrossIcon(13)) : null,
            ),
          );
        };

        const renderCategory = (group) => {
          const category = group.category;
          const isEditing = editing !== null && editing.id === category.id;
          return h('section', {
            key: category.id,
            className: 'wsc-card' + (dropCat === category.id ? ' wsc-card-over' : ''),
            style: groupVars(category.color, appearance, false),
            onDragOver: (event) => {
              if (dragId === null) return;
              event.preventDefault();
              try { event.dataTransfer.dropEffect = 'move'; } catch { /* ignore */ }
              if (dropCat !== category.id) setDropCat(category.id);
            },
            onDragLeave: () => setDropCat((current) => (current === category.id ? null : current)),
            onDrop: (event) => {
              event.preventDefault();
              let workspaceId = dragId;
              try {
                const carried = event.dataTransfer.getData('text/plain');
                if (carried) workspaceId = carried;
              } catch { /* ignore */ }
              if (workspaceId) assign(workspaceId, category.id);
              setDragId(null);
              setDropCat(null);
            },
          },
            h('div', { className: 'wsc-cardhead' },
              h('label', {
                className: 'wsc-catdot',
                title: t('panel.categoryColor'),
                onClick: (event) => event.stopPropagation(),
              },
                h('input', {
                  type: 'color',
                  value: category.color,
                  'aria-label': t('panel.categoryColor'),
                  onChange: (event) => setCategoryColor(category.id, event.target.value),
                }),
                h('span', null),
              ),
              isEditing
                ? h('input', {
                  className: 'wsc-input',
                  style: { width: '260px' },
                  autoFocus: true,
                  value: editing.draft,
                  'aria-label': t('panel.rename'),
                  onChange: (event) => setEditing({ id: category.id, draft: event.target.value }),
                  onBlur: commitRename,
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') { event.preventDefault(); commitRename(); }
                    if (event.key === 'Escape') { event.preventDefault(); setEditing(null); }
                  },
                })
                : h('button', {
                  type: 'button',
                  className: 'wsc-name',
                  title: t('panel.rename'),
                  onClick: () => setEditing({ id: category.id, draft: category.name }),
                }, category.name),
              h('span', { className: 'wsc-count' }, String(group.rows.length)),
              h('div', { className: 'wsc-grow' }),
              h('button', {
                type: 'button',
                className: 'wsc-btn wsc-btn-icon',
                title: t('panel.rename'),
                'aria-label': t('panel.rename'),
                onClick: () => setEditing({ id: category.id, draft: category.name }),
              }, PencilIcon(14)),
              confirmId === category.id
                ? h(React.Fragment, null,
                  h('button', {
                    type: 'button',
                    className: 'wsc-btn wsc-btn-icon wsc-btn-danger',
                    title: t('panel.confirmDelete'),
                    'aria-label': t('panel.confirmDelete'),
                    onClick: () => { removeCategory(category.id); setConfirmId(null); },
                  }, TrashIcon(14)),
                  h('button', {
                    type: 'button',
                    className: 'wsc-btn wsc-btn-icon',
                    title: t('panel.cancel'),
                    'aria-label': t('panel.cancel'),
                    onClick: () => setConfirmId(null),
                  }, CrossIcon(13)),
                )
                : h('button', {
                  type: 'button',
                  className: 'wsc-btn wsc-btn-icon',
                  title: t('panel.delete'),
                  'aria-label': t('panel.delete'),
                  onClick: () => setConfirmId(category.id),
                }, TrashIcon(14)),
            ),
            group.rows.length > 0
              ? h('div', { className: 'wsc-rows' }, group.rows.map((row) => renderRow(row, category)))
              : h('div', { className: 'wsc-empty' }, t('panel.dropHere')),
            h('div', { className: 'wsc-foot' },
              h('select', {
                className: 'wsc-select',
                value: '',
                'aria-label': t('panel.addWorkspace'),
                onChange: (event) => {
                  if (event.target.value !== '') assign(event.target.value, category.id);
                },
              },
                h('option', { value: '' }, t('panel.addWorkspace')),
                unassignedOptions.map((row) => h('option', { key: row.workspaceId, value: row.workspaceId }, nameOf(row))),
              ),
            ),
          );
        };

        /**
         * Live styling controls. The level labels are rendered with the level's
         * own size and colour, so the card previews the hierarchy it edits.
         */
        const renderAppearance = () => {
          const sizeRow = (id, label, sizeKey, previewColor) => h('div', { key: 'size-' + id, className: 'wsc-appearrow' },
            h('span', {
              className: 'wsc-appearname',
              style: { fontSize: appearance[sizeKey] + 'px', color: previewColor },
            }, label),
            h('input', {
              className: 'wsc-range',
              type: 'range',
              min: FONT_MIN,
              max: FONT_MAX,
              step: 1,
              value: appearance[sizeKey],
              'aria-label': label + ' ' + t('appearance.fontSize'),
              onChange: (event) => patchAppearance({ [sizeKey]: clampFontSize(event.target.value, APPEARANCE_DEFAULTS[sizeKey]) }),
            }),
            h('span', { className: 'wsc-unit' }, appearance[sizeKey] + 'px'),
          );

          const colorRow = (key, label, seed) => h('div', { key: 'color-' + key, className: 'wsc-appearrow' },
            h('span', { className: 'wsc-appearname' }, label),
            h('label', { className: 'wsc-swatchwrap', title: t('appearance.pickColor') },
              h('input', {
                type: 'color',
                value: appearance[key] || seed,
                'aria-label': label + ' ' + t('appearance.color'),
                onChange: (event) => {
                  const next = normalizeHex(event.target.value);
                  if (next !== '') patchAppearance({ [key]: next });
                },
              }),
              h('span', {
                className: 'wsc-swatch' + (appearance[key] ? '' : ' wsc-swatch-auto'),
                style: appearance[key] ? { background: appearance[key] } : undefined,
              }),
            ),
            h('button', {
              type: 'button',
              className: 'wsc-mini',
              disabled: appearance[key] === '',
              onClick: () => patchAppearance({ [key]: '' }),
            }, t('appearance.auto')),
          );

          const categoryAccent = categories.length > 0 ? categories[0].color : ACCENTS[0];

          return h('section', { key: '__appearance', className: 'wsc-appear' },
            h('div', { className: 'wsc-appearhead' },
              h('span', { className: 'wsc-appeartitle' }, t('appearance.title')),
              h('span', { className: 'wsc-appeartip' }, t('appearance.tip')),
              h('div', { className: 'wsc-grow' }),
              h('button', { type: 'button', className: 'wsc-btn', onClick: resetAppearance }, t('appearance.reset')),
              h('button', {
                type: 'button',
                className: 'wsc-btn wsc-btn-icon',
                title: t('appearance.close'),
                'aria-label': t('appearance.close'),
                onClick: () => setShowAppearance(false),
              }, CrossIcon(13)),
            ),
            h('div', { className: 'wsc-appearcols' },
              h('div', { className: 'wsc-appearcol' },
                h('div', { className: 'wsc-appeargroup' }, t('appearance.fontSize')),
                sizeRow('category', t('appearance.category'), 'categoryFontSize', appearance.accentNames ? categoryAccent : 'var(--dsw-alias-label-primary)'),
                sizeRow('workspace', t('appearance.workspace'), 'workspaceFontSize', appearance.workspaceColor || 'var(--dsw-alias-label-primary)'),
                sizeRow('session', t('appearance.session'), 'sessionFontSize', appearance.sessionColor || 'var(--dsw-alias-label-secondary)'),
              ),
              h('div', { className: 'wsc-appearcol' },
                h('div', { className: 'wsc-appeargroup' }, t('appearance.color')),
                colorRow('workspaceColor', t('appearance.workspace'), '#1C1917'),
                colorRow('sessionColor', t('appearance.session'), '#78716C'),
                h('label', { className: 'wsc-switch wsc-appearswitch' },
                  h('input', {
                    type: 'checkbox',
                    checked: appearance.accentNames === true,
                    onChange: (event) => patchAppearance({ accentNames: event.target.checked }),
                  }),
                  h('span', null, t('appearance.accentNames')),
                ),
              ),
              h('div', { className: 'wsc-appearcol' },
                h('div', { className: 'wsc-appeargroup' }, t('appearance.background')),
                colorRow('categoryBg', t('appearance.categoryBg'), '#F5F1EC'),
                colorRow('cardBg', t('appearance.cardBg'), '#FFFFFF'),
                colorRow('panelBg', t('appearance.panelBg'), '#FFFFFF'),
              ),
            ),
            h('p', { className: 'wsc-appeartip wsc-appeartip-foot' }, t('appearance.categoryColorHint')),
          );
        };

        const body = [];
        if (showAppearance) body.push(renderAppearance());
        if (loading) {
          body.push(h('div', { key: 'loading', className: 'wsc-note' }, t('panel.loading')));
        } else if (items.length === 0) {
          body.push(h('div', { key: 'empty', className: 'wsc-note' }, t('panel.empty')));
        } else if (totalVisible === 0 && trimmedQuery !== '') {
          body.push(h('div', { key: 'nomatch', className: 'wsc-note' }, t('panel.noMatch')));
        }

        if (!loading && items.length > 0) {
          for (const group of visibleGroups) body.push(renderCategory(group));
          if (loose.length > 0) {
            body.push(h('section', { key: '__loose', className: 'wsc-card', style: groupVars('', appearance, true) },
              h('div', { className: 'wsc-cardhead' },
                h('span', { className: 'wsc-name', style: { cursor: 'default' } }, t('panel.uncategorized')),
                h('span', { className: 'wsc-count' }, String(loose.length)),
              ),
              h('div', { className: 'wsc-rows' }, loose.map((row) => renderRow(row, null))),
            ));
          }
          body.push(h('div', { key: '__hint', className: 'wsc-hint' },
            loose.length > 0 ? t('panel.uncategorizedHint') : t('panel.dragHint')));
        }

        return h('div', {
          className: 'wsc-root' + (appearance.accentNames ? ' wsc-accent' : ''),
          style: appearanceVars(appearance),
        },
          h('style', { key: 'css' }, PANEL_CSS),
          h('div', { className: 'wsc-head' },
            h('div', { className: 'wsc-titlerow' },
              h('div', { className: 'wsc-grow' },
                h('h1', { className: 'wsc-title' }, t('panel.title')),
                h('p', { className: 'wsc-sub' }, t('panel.subtitle')),
              ),
              h('span', { className: 'wsc-chip' }, t('panel.count', { n: items.length })),
              showSwitcherHint === true
                ? h('button', {
                  type: 'button',
                  className: 'wsc-chip wsc-kbd',
                  title: t('switcher.hint'),
                  'aria-label': t('switcher.hint'),
                  onClick: () => {
                    if (typeof onOpenSwitcher === 'function') onOpenSwitcher();
                  },
                }, IS_MAC ? '⌃Tab' : 'Ctrl+Tab')
                : null,
            ),
            h('div', { className: 'wsc-toolbar' },
              h('input', {
                className: 'wsc-input wsc-search',
                type: 'search',
                value: query,
                placeholder: t('panel.searchPlaceholder'),
                'aria-label': t('panel.searchPlaceholder'),
                onChange: (event) => setQuery(event.target.value),
              }),
              h('div', { className: 'wsc-grow' }),
              h('label', { className: 'wsc-switch', title: t('panel.sidebarHint') },
                h('input', {
                  type: 'checkbox',
                  checked: state.sidebarGrouping !== false,
                  onChange: (event) => store.set((prev) => ({ ...prev, sidebarGrouping: event.target.checked })),
                }),
                h('span', null, t('panel.sidebarToggle')),
              ),
              h('button', {
                type: 'button',
                className: 'wsc-btn' + (showAppearance ? ' wsc-btn-on' : ''),
                title: t('appearance.title'),
                'aria-expanded': showAppearance,
                onClick: () => setShowAppearance((open) => !open),
              }, SlidersIcon(14), t('panel.appearance')),
              h('button', {
                type: 'button',
                className: 'wsc-btn wsc-btn-primary',
                onClick: addCategory,
              }, PlusIcon(14), t('panel.newCategory')),
            ),
          ),
          h('div', { className: 'wsc-body' }, body),
        );
      };
    }

    // #endregion

    // #region categorized sidebar browser

    function createSidebarBrowser(services) {
      return function CategorizedWorkspaceBrowser(props) {
        const t = React.useMemo(() => createTranslate(props.t), [props.t]);
        const state = useStore();
        const appearance = state.appearance || APPEARANCE_DEFAULTS;
        const snapshot = typeof props.useWorkspaces === 'function' ? props.useWorkspaces((s) => s) : null;
        const list = typeof props.useSessions === 'function' ? props.useSessions((s) => s) : null;

        const [query, setQuery] = React.useState('');
        const [searchOpen, setSearchOpen] = React.useState(false);
        const [collapsedGroups, setCollapsedGroups] = React.useState({});
        const [collapsedWorkspaces, setCollapsedWorkspaces] = React.useState({});
        const [extraRows, setExtraRows] = React.useState({});
        const [dragId, setDragId] = React.useState(null);
        const [dropCat, setDropCat] = React.useState(null);
        const [notice, setNotice] = React.useState(null);
        const [menuId, setMenuId] = React.useState(null);
        const [renamingId, setRenamingId] = React.useState(null);
        const [renameDraft, setRenameDraft] = React.useState('');
        const [deleteId, setDeleteId] = React.useState(null);
        const renameGuard = React.useRef(false);

        const items = (snapshot && Array.isArray(snapshot.items)) ? snapshot.items : [];
        const archived = new Set((snapshot && snapshot.archivedSessionIds) || []);
        const summaries = (list && list.byId) || {};

        const nameOf = (row) => (row.title && row.title !== '' ? row.title : baseName(row.path));

        const sessionsOf = (row) => {
          const out = [];
          for (const id of row.sessionIds || []) {
            const summary = summaries[id];
            if (!summary || summary.blank || archived.has(id)) continue;
            out.push(summary);
          }
          out.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          return out;
        };

        const trimmed = query.trim().toLowerCase();
        const matchesText = (text) => trimmed === '' || String(text || '').toLowerCase().includes(trimmed);
        const matchesRow = (row) => trimmed === ''
          || matchesText(nameOf(row))
          || matchesText(row.path)
          || sessionsOf(row).some((summary) => matchesText(summary.title));

        const categories = state.categories;
        const categoryIds = new Set(categories.map((row) => row.id));
        const groups = categories.map((category) => ({
          id: category.id,
          name: category.name,
          color: category.color,
          workspaces: items.filter((row) => state.assignments[row.workspaceId] === category.id),
        }));
        const loose = items.filter((row) => !categoryIds.has(state.assignments[row.workspaceId]));
        if (loose.length > 0) {
          groups.push({
            id: '__loose',
            name: t('list.uncategorized'),
            color: '',
            workspaces: loose,
            loose: true,
          });
        }

        const assign = (workspaceId, categoryId) => {
          store.set((prev) => {
            const assignments = { ...prev.assignments };
            if (!categoryId) delete assignments[workspaceId];
            else assignments[workspaceId] = categoryId;
            return { ...prev, assignments };
          });
        };

        const openConversation = () => {
          try { services.showConversation(); } catch { /* ignore */ }
        };

        const openWorkspace = (workspaceId) => {
          openConversation();
          try {
            const pending = services.openWorkspace(workspaceId);
            if (pending && typeof pending.catch === 'function') pending.catch(() => {});
          } catch { /* ignore */ }
        };

        const openSession = (sessionId) => {
          openConversation();
          try { services.openSession(sessionId); } catch { /* ignore */ }
        };

        /**
         * The shipped browser's row action: start (or reuse) a blank conversation
         * in this workspace. The browser hands `startSession` down as a prop, so
         * prefer it and fall back to the service for slot-less mounts.
         */
        const startConversation = (workspaceId) => {
          openConversation();
          const start = typeof props.startSession === 'function' ? props.startSession : services.startSession;
          try {
            const pending = start(workspaceId, { clearPreviousDraft: false });
            if (pending && typeof pending.catch === 'function') pending.catch(() => {});
          } catch { /* ignore */ }
        };

        const flash = (message) => {
          setNotice(message);
          window.setTimeout(() => setNotice(null), 6000);
        };

        const archiveSession = (sessionId) => {
          const fail = (error) => flash(t('list.archiveFailed', {
            message: error && error.message ? error.message : String(error),
          }));
          try {
            const pending = services.archiveSession(sessionId);
            if (pending && typeof pending.catch === 'function') pending.catch(fail);
          } catch (error) {
            fail(error);
          }
        };

        const addWorkspace = () => {
          Promise.resolve()
            .then(() => services.pickDirectory())
            .then((path) => (path ? services.createWorkspace({ path }) : undefined))
            .then((created) => {
              if (created && created.workspaceId) openWorkspace(created.workspaceId);
            })
            .catch((error) => flash(error && error.message ? error.message : String(error)));
        };

        const toggleGroup = (id) => setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
        const toggleWorkspace = (id) => setCollapsedWorkspaces((prev) => ({ ...prev, [id]: !prev[id] }));

        /**
         * One-click "collapse all": fold every category and every workspace, so
         * the sidebar becomes a compact stack of group headers. There is no
         * expand-all counterpart on purpose — each group and workspace opens
         * from its own chevron. A live search forces matches open, so collapse
         * clears the query first instead of silently doing nothing.
         */
        const collapseAll = () => {
          if (trimmed !== '') setQuery('');
          setCollapsedGroups(() => {
            const next = {};
            for (const group of groups) next[group.id] = true;
            return next;
          });
          setCollapsedWorkspaces(() => {
            const next = {};
            for (const row of items) next[row.workspaceId] = true;
            return next;
          });
        };

        const beginRename = (row) => {
          renameGuard.current = false;
          setMenuId(null);
          setRenameDraft(nameOf(row));
          setRenamingId(row.workspaceId);
        };

        const cancelRename = () => {
          renameGuard.current = true;
          setRenamingId(null);
          setRenameDraft('');
        };

        const commitRename = (row) => {
          if (renameGuard.current) {
            renameGuard.current = false;
            return;
          }
          renameGuard.current = true;
          const title = renameDraft.trim();
          setRenamingId(null);
          if (title === '' || title === nameOf(row)) return;
          const fail = (error) => flash(t('list.renameFailed', {
            message: error && error.message ? error.message : String(error),
          }));
          const rename = typeof props.renameWorkspace === 'function' ? props.renameWorkspace : services.renameWorkspace;
          try {
            const pending = rename(row.workspaceId, title);
            if (pending && typeof pending.catch === 'function') pending.catch(fail);
          } catch (error) {
            fail(error);
          }
        };

        const removeWorkspace = (row) => {
          setDeleteId(null);
          const fail = (error) => flash(t('list.deleteFailed', {
            message: error && error.message ? error.message : String(error),
          }));
          const forget = () => store.set((prev) => {
            if (!Object.prototype.hasOwnProperty.call(prev.assignments, row.workspaceId)) return prev;
            const assignments = { ...prev.assignments };
            delete assignments[row.workspaceId];
            return { ...prev, assignments };
          });
          const remove = typeof props.deleteWorkspace === 'function' ? props.deleteWorkspace : services.deleteWorkspace;
          try {
            const pending = remove(row.workspaceId);
            if (pending && typeof pending.then === 'function') pending.then(forget).catch(fail);
            else forget();
          } catch (error) {
            fail(error);
          }
        };

        /**
         * Hand this workspace directory to the Host desktop so Finder (macOS) or
         * File Explorer (Windows) opens it. The Host verifies the path first, so
         * a refusal comes back as `false` instead of a thrown error.
         */
        const openWorkspaceDirectory = (row) => {
          const path = typeof row.path === 'string' ? row.path : '';
          if (path === '') {
            flash(t('list.openDirectoryNoPath'));
            return;
          }
          const fail = (error) => flash(t('list.openDirectoryFailed', {
            message: error && error.message ? error.message : String(error),
          }));
          let pending;
          try {
            pending = services.openDirectory(path);
          } catch (error) {
            fail(error);
            return;
          }
          if (pending && typeof pending.then === 'function') {
            pending
              .then((opened) => {
                if (opened !== true) flash(t('list.openDirectoryUnsupported'));
              })
              .catch(fail);
          }
        };

        /**
         * Hand this workspace directory to the Host desktop so an installed VS
         * Code window opens on it. The Host resolves the editor itself (Launch
         * Services on macOS, registered handlers elsewhere) and answers with a
         * reason when nothing can be launched, so this never guesses a path.
         */
        const openWorkspaceInVscode = (row) => {
          const path = typeof row.path === 'string' ? row.path : '';
          if (path === '') {
            flash(t('list.openDirectoryNoPath'));
            return;
          }
          const report = (result) => {
            if (result && result.ok === true) return;
            const reason = result && typeof result.reason === 'string' ? result.reason : '';
            if (reason === 'noPath') flash(t('list.openDirectoryNoPath'));
            else if (reason === 'unsupported') flash(t('list.openInVscodeUnsupported'));
            else flash(t('list.openInVscodeUnavailable'));
          };
          const fail = (error) => flash(t('list.openInVscodeFailed', {
            message: error && error.message ? error.message : String(error),
          }));
          let pending;
          try {
            pending = services.openInVscode(path);
          } catch (error) {
            fail(error);
            return;
          }
          if (pending && typeof pending.then === 'function') pending.then(report).catch(fail);
        };

        const rowMenuItems = () => [
          {
            id: 'directory',
            label: t('list.openDirectory'),
            icon: IconFolderOpen !== null ? h(IconFolderOpen, {}) : OpenExternalIcon(14),
          },
          {
            id: 'vscode',
            label: t('list.openInVscode'),
            icon: IconCode !== null ? h(IconCode, {}) : CodeIcon(14),
          },
          {
            id: 'rename',
            label: t('list.renameWorkspace'),
            icon: IconEdit !== null ? h(IconEdit, {}) : undefined,
          },
          {
            id: 'delete',
            label: t('list.deleteWorkspace'),
            icon: IconTrash !== null ? h(IconTrash, {}) : undefined,
            danger: true,
          },
        ];

        const renderSession = (summary) => {
          const title = summary.title && summary.title.trim() !== '' ? summary.title : t('list.untitled');
          return h('div', {
            key: summary.id,
            className: 'wscb-sessionrow',
            role: 'button',
            tabIndex: 0,
            title,
            onClick: () => openSession(summary.id),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openSession(summary.id);
              }
            },
          },
            h('span', { className: 'wscb-slot' },
              summary.running === true ? h('span', { className: 'wscb-dot' }) : null),
            h('span', { className: 'wscb-title' }, title),
            h('span', { className: 'wscb-time' }, relativeTime(summary.updatedAt, t)),
            h('span', { className: 'wscb-rowactions' },
              h('button', {
                type: 'button',
                className: 'wscb-iconbtn wscb-icon-sm',
                title: t('list.archive'),
                'aria-label': t('list.archive'),
                onClick: (event) => {
                  event.stopPropagation();
                  archiveSession(summary.id);
                },
              }, CrossIcon(12)),
            ),
          );
        };

        const renderWorkspace = (row) => {
          if (!matchesRow(row)) return null;
          const sessions = sessionsOf(row);
          const visibleCount = SESSION_PAGE + (extraRows[row.workspaceId] || 0);
          const open = collapsedWorkspaces[row.workspaceId] !== true;
          const showSessions = open || trimmed !== '';
          return h('div', {
            key: row.workspaceId,
            className: 'wscb-projectgroup',
            draggable: true,
            style: dragId === row.workspaceId ? { opacity: 0.45 } : undefined,
            onDragStart: (event) => {
              setDragId(row.workspaceId);
              try {
                event.dataTransfer.setData('text/plain', row.workspaceId);
                event.dataTransfer.effectAllowed = 'move';
              } catch { /* ignore */ }
            },
            onDragEnd: () => { setDragId(null); setDropCat(null); },
          },
            h('div', {
              className: 'wscb-projectrow' + (menuId === row.workspaceId ? ' wscb-menuopen' : ''),
              role: 'button',
              tabIndex: 0,
              title: row.path || nameOf(row),
              onClick: () => openWorkspace(row.workspaceId),
              onKeyDown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openWorkspace(row.workspaceId);
                }
              },
            },
              h('span', {
                className: 'wscb-lead',
                role: 'button',
                'aria-label': nameOf(row),
                'aria-expanded': showSessions,
                onClick: (event) => {
                  event.stopPropagation();
                  toggleWorkspace(row.workspaceId);
                },
              },
                h('span', { className: 'wscb-folder' }, FolderIcon(16)),
                h('span', { className: 'wscb-chevron', style: { transform: showSessions ? 'rotate(90deg)' : 'none' } }, ChevronIcon(14)),
              ),
              renamingId === row.workspaceId
                ? h('input', {
                  className: 'wscb-renameinput',
                  type: 'text',
                  autoFocus: true,
                  value: renameDraft,
                  'aria-label': t('list.renameWorkspace'),
                  onClick: (event) => event.stopPropagation(),
                  onChange: (event) => setRenameDraft(event.target.value),
                  onKeyDown: (event) => {
                    event.stopPropagation();
                    if (event.key === 'Enter') commitRename(row);
                    else if (event.key === 'Escape') cancelRename();
                  },
                  onBlur: () => commitRename(row),
                })
                : h('span', { className: 'wscb-title' }, nameOf(row)),
              h('span', { className: 'wscb-count' }, String(sessions.length)),
              h('span', { className: 'wscb-projectactions' },
                MenuPrimitive !== null
                  ? h(MenuPrimitive, {
                    open: menuId === row.workspaceId,
                    onClose: () => setMenuId(null),
                    items: rowMenuItems(),
                    onSelect: (id) => {
                      setMenuId(null);
                      if (id === 'directory') openWorkspaceDirectory(row);
                      else if (id === 'vscode') openWorkspaceInVscode(row);
                      else if (id === 'rename') beginRename(row);
                      else if (id === 'delete') setDeleteId(row.workspaceId);
                    },
                    portal: true,
                    closeOnPointerLeave: true,
                    anchor: h('button', {
                      type: 'button',
                      className: 'wscb-iconaction',
                      'aria-label': t('list.workspaceActions', { name: nameOf(row) }),
                      onClick: (event) => {
                        event.stopPropagation();
                        setMenuId((current) => (current === row.workspaceId ? null : row.workspaceId));
                      },
                    }, IconEllipsis !== null ? h(IconEllipsis, {}) : ChevronIcon(14)),
                  })
                  : null,
                h('button', {
                  type: 'button',
                  className: 'wscb-iconaction',
                  title: t('list.newChat'),
                  'aria-label': t('list.newChatAria', { name: nameOf(row) }),
                  onClick: (event) => {
                    event.stopPropagation();
                    startConversation(row.workspaceId);
                  },
                }, NewChatIcon(16)),
              ),
            ),
            deleteId === row.workspaceId
              ? h('div', { className: 'wscb-confirm' },
                h('div', { className: 'wscb-confirmtext' }, t('list.deleteWorkspaceConfirm', { name: nameOf(row) })),
                h('div', { className: 'wscb-confirmactions' },
                  h('button', {
                    type: 'button',
                    className: 'wscb-confirmbtn',
                    onClick: () => setDeleteId(null),
                  }, t('list.cancel')),
                  h('button', {
                    type: 'button',
                    className: 'wscb-confirmbtn wscb-confirmdanger',
                    onClick: () => removeWorkspace(row),
                  }, t('list.deleteWorkspace')),
                ),
              )
              : null,
            showSessions ? sessions.slice(0, visibleCount).map((summary) => renderSession(summary)) : null,
            showSessions && sessions.length > visibleCount
              ? h('button', {
                type: 'button',
                className: 'wscb-more',
                onClick: () => setExtraRows((prev) => ({
                  ...prev,
                  [row.workspaceId]: (prev[row.workspaceId] || 0) + SESSION_PAGE,
                })),
              }, t('list.showMore', { n: sessions.length - visibleCount }))
              : null,
          );
        };

        const renderGroup = (group) => {
          const rows = group.workspaces.filter(matchesRow);
          if (trimmed !== '' && rows.length === 0) return null;
          const collapsed = collapsedGroups[group.id] === true && trimmed === '';
          return h('section', {
            key: group.id,
            className: 'wscb-group' + (dropCat === group.id ? ' wscb-drop' : ''),
            style: groupVars(group.color, appearance, group.loose === true),
            onDragOver: (event) => {
              if (dragId === null) return;
              event.preventDefault();
              try { event.dataTransfer.dropEffect = 'move'; } catch { /* ignore */ }
              if (dropCat !== group.id) setDropCat(group.id);
            },
            onDragLeave: () => setDropCat((current) => (current === group.id ? null : current)),
            onDrop: (event) => {
              event.preventDefault();
              let workspaceId = dragId;
              try {
                const carried = event.dataTransfer.getData('text/plain');
                if (carried) workspaceId = carried;
              } catch { /* ignore */ }
              if (workspaceId && !group.loose) assign(workspaceId, group.id);
              setDragId(null);
              setDropCat(null);
            },
          },
            h('button', {
              type: 'button',
              className: 'wscb-grouphead',
              onClick: () => toggleGroup(group.id),
              'aria-expanded': !collapsed,
            },
              h('span', { className: 'wscb-gchev', style: { transform: collapsed ? 'none' : 'rotate(90deg)' } }, ChevronIcon(13)),
              h('span', { className: 'wscb-gname' }, group.name),
              h('span', { className: 'wscb-gcount' }, String(rows.length)),
            ),
            collapsed ? null : rows.length === 0
              ? h('div', { className: 'wscb-empty' }, t('list.emptyCategory'))
              : h('div', { className: 'wscb-rows' }, rows.map((row) => renderWorkspace(row))),
          );
        };

        const body = [];
        if (items.length === 0) {
          body.push(h('div', { key: 'empty', className: 'wscb-hint' }, t('list.empty')));
        } else if (categories.length === 0) {
          body.push(h('div', { key: 'nocat', className: 'wscb-hint' }, t('list.noCategories')));
          body.push(h('section', { key: '__all', className: 'wscb-group' },
            h('div', { className: 'wscb-rows' }, items.map((row) => renderWorkspace(row))),
          ));
        } else {
          for (const group of groups) {
            const rendered = renderGroup(group);
            if (rendered !== null) body.push(rendered);
          }
          if (trimmed !== '' && body.length === 0) {
            body.push(h('div', { key: 'nomatch', className: 'wscb-hint' }, t('list.noMatch')));
          }
        }

        return h('div', {
          className: 'wscb-root' + (appearance.accentNames ? ' wsc-accent' : ''),
          style: appearanceVars(appearance),
        },
          h('style', { key: 'css' }, LIST_CSS),
          h('div', { className: 'wscb-sectionheader' },
            h('span', { className: 'wscb-sectionlabel' }, t('list.workspaces')),
            h('div', { className: 'wscb-searchslot' },
              searchOpen
                ? h('input', {
                  className: 'wscb-searchbox',
                  type: 'search',
                  autoFocus: true,
                  value: query,
                  placeholder: t('list.search'),
                  'aria-label': t('list.search'),
                  onChange: (event) => setQuery(event.target.value),
                })
                : null,
            ),
            h('div', { className: 'wscb-actions' },
              h('button', {
                type: 'button',
                className: 'wscb-iconbtn',
                title: t('list.search'),
                'aria-label': t('list.search'),
                onClick: () => {
                  setSearchOpen((open) => {
                    if (open) setQuery('');
                    return !open;
                  });
                },
              }, SearchIcon(16)),
              h('button', {
                type: 'button',
                className: 'wscb-iconbtn',
                title: t('list.collapseAll'),
                'aria-label': t('list.collapseAll'),
                onClick: collapseAll,
              }, CollapseAllIcon(16)),
              h('button', {
                type: 'button',
                className: 'wscb-iconbtn',
                title: t('list.addWorkspace'),
                'aria-label': t('list.addWorkspace'),
                onClick: addWorkspace,
              }, PlusIcon(16)),
              h('button', {
                type: 'button',
                className: 'wscb-iconbtn',
                title: t('list.manage'),
                'aria-label': t('list.manage'),
                onClick: () => { try { services.openPanel(); } catch { /* ignore */ } },
              }, SlidersIcon(16)),
            ),
          ),
          notice ? h('div', { className: 'wscb-notice' }, notice) : null,
          h('div', { className: 'wscb-listarea' },
            h('div', { className: 'wscb-list' }, body),
          ),
        );
      };
    }

    // #endregion

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, DICT), 'workspace-categories: dictionaries');
      const t = ctx.locale.bind(NS);
      const title = () => {
        let value;
        try { value = t('panel.title'); } catch { value = undefined; }
        if (typeof value !== 'string' || value === '' || value === 'panel.title') {
          value = Object.prototype.hasOwnProperty.call(FALLBACK, 'panel.title')
            ? FALLBACK['panel.title']
            : '工作区分类';
        }
        return value;
      };

      /**
       * Resolve the composed Session Remote lazily: a composition without it
       * still loads this panel, it simply cannot reach the Host desktop.
       */
      const sessionRemote = () => {
        let session;
        try { session = ctx.get('remote.session'); } catch { session = undefined; }
        if (!session) {
          try { session = ctx.remote && ctx.remote.session; } catch { session = undefined; }
        }
        return session || null;
      };

      /**
       * Open one workspace directory in the Host file manager.
       *
       * The Host owns the only path that may touch the desktop: the Session
       * Remote's `openWorkspacePath`, which re-verifies the directory against
       * the composed filesystem and then launches Finder on macOS, File
       * Explorer on Windows, or the XDG file manager on Linux. The answer is
       * `true` only after the Host acknowledged the launch.
       */
      const openDirectory = async (path) => {
        if (typeof path !== 'string' || path === '') return false;
        const session = sessionRemote();
        if (!session || typeof session.openWorkspacePath !== 'function') return false;
        const result = await session.openWorkspacePath({ path });
        return Boolean(result && result.ok === true);
      };

      /**
       * Recognise a VS Code handler from the Host's registered-application
       * list. The identifier is a bundle path on macOS, an executable path on
       * Windows, and a desktop-entry id on Linux, so both fields are checked.
       */
      const isVscodeApplication = (application) => {
        if (!application || typeof application.id !== 'string') return false;
        const name = typeof application.name === 'string' ? application.name : '';
        const id = application.id;
        return /visual studio code/i.test(name)
          || /Visual Studio Code(?: - Insiders)?\.app$/i.test(id)
          || /[\\/]Code(?: - Insiders)?\.exe$/i.test(id)
          || /^code(?:-insiders)?(?:\.desktop)?$/i.test(id);
      };

      /**
       * Ask the Host open-in-app catalog to launch one verified application.
       * The route is served by the Host's own catalog launcher; a composition
       * without it answers 404, which reads as "not available" here.
       */
      const openWithCatalogApp = async (app, path) => {
        if (typeof fetch !== 'function') return false;
        try {
          const response = await fetch('open-in-app/open', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ app, path }),
          });
          return response.ok === true;
        } catch {
          return false;
        }
      };

      /**
       * Open one workspace directory in VS Code.
       *
       * Two Host routes are tried in order because neither covers every
       * install on its own: the Session Remote's registered-handler list
       * (Launch Services on macOS, the OS association query elsewhere) finds a
       * VS Code that was installed outside the catalog's known application
       * directories, while the open-in-app catalog launcher covers a plain
       * system install. Both verify the directory on the Host before any
       * process starts, so this never passes an unverified path to a launcher.
       */
      const openInVscode = async (path) => {
        if (typeof path !== 'string' || path === '') return { ok: false, reason: 'noPath' };
        const session = sessionRemote();
        if (!session) return { ok: false, reason: 'unsupported' };
        if (typeof session.workspacePathApplications === 'function'
          && typeof session.openWorkspacePath === 'function') {
          try {
            const listed = await session.workspacePathApplications({ path });
            const applications = listed && listed.ok === true && Array.isArray(listed.value)
              ? listed.value
              : [];
            const candidates = applications.filter(isVscodeApplication);
            const stable = candidates.find((application) => !/insiders/i.test(
              application.id + ' ' + (typeof application.name === 'string' ? application.name : ''),
            ));
            const target = stable || candidates[0];
            if (target) {
              const opened = await session.openWorkspacePath({ path, application: target.id });
              if (opened && opened.ok === true) return { ok: true };
            }
          } catch { /* the catalog launcher below is the fallback */ }
        }
        if (await openWithCatalogApp('vscode', path)) return { ok: true };
        return { ok: false, reason: 'unavailable' };
      };

      const services = {
        showConversation: () => ctx.layout.selectPanel(null),
        openPanel: () => ctx.layout.selectPanel(PANEL_ID),
        openSession: (sessionId) => ctx.uiWorkspace.openSession(sessionId),
        openWorkspace: (workspaceId) => ctx.uiWorkspace.openWorkspace(workspaceId),
        startSession: (workspaceId) => ctx.uiWorkspace.startSession(workspaceId, { clearPreviousDraft: false }),
        pickDirectory: () => ctx.uiWorkspace.pickDirectory(),
        createWorkspace: (input) => ctx.workspaces.create(input),
        renameWorkspace: (workspaceId, title) => ctx.workspaces.rename(workspaceId, title),
        deleteWorkspace: (workspaceId) => ctx.workspaces.delete(workspaceId),
        archiveSession: (sessionId) => ctx.workspaces.archiveSession(sessionId),
        openDirectory: (path) => openDirectory(path),
        openInVscode: (path) => openInVscode(path),
      };

      /**
       * Recent-conversation switcher. The Session catalog is read through the
       * composed service rather than declared in `inject`: a composition that
       * lacks it should still get the categories, just without `Ctrl+Tab`.
       */
      let sessionCatalog = null;
      try { sessionCatalog = ctx.get('sessions'); } catch { sessionCatalog = null; }
      if (!sessionCatalog) {
        try { sessionCatalog = ctx.sessions; } catch { sessionCatalog = null; }
      }
      const canSwitch = sessionCatalog !== null
        && sessionCatalog !== undefined
        && sessionCatalog.list
        && typeof sessionCatalog.list.getSnapshot === 'function';

      const recentSwitcher = canSwitch
        ? createRecentSwitcher({
          sessions: sessionCatalog,
          workspaces: ctx.workspaces,
          openSession: services.openSession,
          showConversation: services.showConversation,
          t,
        })
        : null;

      const Panel = createPanel(services, recentSwitcher !== null, () => {
        if (recentSwitcher !== null) recentSwitcher.toggle();
      });
      const Sidebar = createSidebarBrowser(services);

      if (recentSwitcher !== null) {
        ctx.effect(() => () => recentSwitcher.dispose(), 'workspace-categories: recent switcher');
        ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'workspace-categories.recent-switcher',
          locale: NS,
          inject: () => ({
            hooks: { switcher },
            choose: (sessionId) => recentSwitcher.choose(sessionId),
            focusRow: (index) => recentSwitcher.focusRow(index),
            cancel: () => recentSwitcher.cancel(),
          }),
        }, RecentSwitcherOverlay)), 'workspace-categories: recent switcher overlay');
      }

      ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        locale: NS,
      }, Panel)), 'workspace-categories: main panel');

      ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 34,
        label: () => title(),
        locale: NS,
      }, PanelIcon)), 'workspace-categories: sidebar entry');

      // Occupy the sidebar browsing region while grouping is on: a lower
      // priority wins the single cell, and disposing the registration hands the
      // region straight back to the shipped browser.
      let disposeSidebar = null;
      const syncSidebar = () => {
        const current = store.get();
        const on = current.sidebarGrouping !== false && current.categories.length > 0;
        if (on && disposeSidebar === null) {
          disposeSidebar = ctx.slots.inject('sidebar.workspaces', () => ctx.slots.register({
            name: 'sidebar.workspaces',
            priority: -10,
            locale: NS,
          }, Sidebar));
        } else if (!on && disposeSidebar !== null) {
          disposeSidebar();
          disposeSidebar = null;
        }
      };
      const unsubscribe = store.subscribe(syncSidebar);
      syncSidebar();
      ctx.effect(() => () => {
        unsubscribe();
        if (disposeSidebar !== null) {
          disposeSidebar();
          disposeSidebar = null;
        }
      }, 'workspace-categories: sidebar grouping');
    }

    return {
      inject: ['slots', 'locale', 'layout', 'uiWorkspace', 'workspaces'],
      apply,
    };
  },
});
