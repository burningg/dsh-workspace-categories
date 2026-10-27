window.__ModuleLoader__.load({
  id: 'dsh-workspace-categories',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'dsh-workspace-categories';
    const PANEL_ID = 'workspace-categories';
    const STORAGE_KEY = 'dsh.workspace-categories.v2';
    const LEGACY_KEY = 'dsh.workspace-categories.v1';
    const ACCENTS = ['#2F6FED', '#0E9F9A', '#22A06B', '#D97706', '#DC2626', '#A855F7', '#DB2777', '#0891B2'];
    const SESSION_PAGE = 5;

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
        'list.workspaces': 'Workspaces',
        'list.search': 'Search chats…',
        'list.addWorkspace': 'Add workspace',
        'list.manage': 'Manage categories',
        'list.uncategorized': 'Uncategorized',
        'list.empty': 'No workspaces yet',
        'list.noMatch': 'Nothing matches',
        'list.emptyCategory': 'Drag a workspace here',
        'list.showMore': 'Show {n} more',
        'list.archive': 'Archive',
        'list.archiveFailed': 'Could not archive: {message}',
        'list.untitled': 'Untitled',
        'list.noCategories': 'No categories yet — open Manage categories to create one.',
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
        'list.workspaces': '工作区',
        'list.search': '搜索会话…',
        'list.addWorkspace': '添加工作区',
        'list.manage': '分类管理',
        'list.uncategorized': '未分类',
        'list.empty': '还没有工作区',
        'list.noMatch': '没有匹配项',
        'list.emptyCategory': '把工作区拖到这里',
        'list.showMore': '显示更多（{n}）',
        'list.archive': '归档',
        'list.archiveFailed': '归档失败：{message}',
        'list.untitled': '未命名',
        'list.noCategories': '还没有分类 —— 打开「分类管理」新建一个。',
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
      return { categories: [], assignments: {}, sidebarGrouping: true };
    }

    function normalize(parsed) {
      if (!parsed || typeof parsed !== 'object') return defaultState();
      const categories = Array.isArray(parsed.categories)
        ? parsed.categories
          .filter((row) => row && typeof row.id === 'string' && row.id !== '')
          .map((row, index) => ({
            id: row.id,
            name: typeof row.name === 'string' && row.name.trim() !== '' ? row.name : '—',
            color: typeof row.color === 'string' && row.color !== '' ? row.color : ACCENTS[index % ACCENTS.length],
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

    function svg(size, children) {
      return h('svg', {
        width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
        'aria-hidden': true, style: { display: 'block', flex: 'none' },
      }, children);
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

    function PlusIcon(size) {
      return svg(size || 14, [
        h('path', { key: 'p', d: 'M12 5.5v13M5.5 12h13', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' }),
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
.wsc-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-family:inherit}
.wsc-head{padding:24px 32px 14px;display:flex;flex-direction:column;gap:14px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none}
.wsc-titlerow{display:flex;align-items:flex-start;gap:12px}
.wsc-title{margin:0;font-size:20px;line-height:28px;font-weight:600}
.wsc-sub{margin:2px 0 0;font-size:13px;line-height:19px;color:var(--dsw-alias-label-secondary)}
.wsc-grow{flex:1;min-width:0}
.wsc-chip{flex:none;font-size:12px;line-height:18px;padding:1px 8px;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);white-space:nowrap}
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
.wsc-card{border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg,12px);background:var(--dsw-alias-bg-layer-1);overflow:hidden;flex:none}
.wsc-card-over{border-color:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary))}
.wsc-cardhead{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 12px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.wsc-name{max-width:46ch;margin:0;padding:2px 4px;border:none;border-radius:var(--dsw-radius-sm);background:0 0;color:inherit;font-family:inherit;font-size:14px;line-height:20px;font-weight:600;cursor:text;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wsc-name:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wsc-count{flex:none;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);white-space:nowrap}
.wsc-rows{display:flex;flex-direction:column}
.wsc-row{display:flex;align-items:center;gap:8px;min-height:34px;padding:4px 8px 4px 12px;cursor:pointer;border-top:1px solid var(--dsw-alias-border-l1);outline:none}
.wsc-row:first-child{border-top:none}
.wsc-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wsc-row:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary));outline-offset:-2px}
.wsc-row-drag{opacity:.45}
.wsc-rowtitle{font-size:14px;line-height:20px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wsc-path{font-size:12px;line-height:17px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wsc-actions{display:flex;align-items:center;gap:4px;opacity:0;transition:opacity .12s;flex:none}
.wsc-row:hover .wsc-actions,.wsc-actions:focus-within,.wsc-actions-on{opacity:1}
.wsc-empty{padding:10px 12px 12px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.wsc-foot{display:flex;align-items:center;gap:8px;padding:6px 12px 8px}
.wsc-select{max-width:240px;height:26px;padding:0 4px;border-radius:var(--dsw-radius-sm);border:.5px solid var(--dsw-alias-border-l4);background:0 0;color:var(--dsw-alias-label-primary);font-size:12px;font-family:inherit;cursor:pointer}
.wsc-select:focus{outline:none;border-color:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary))}
.wsc-hint{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);padding:0 2px}
.wsc-note{padding:12px;font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-secondary);border:1px dashed var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-lg,12px)}
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
.wscb-group+.wscb-group{margin-top:6px}
.wscb-grouphead{box-sizing:border-box;display:flex;align-items:center;gap:6px;width:100%;height:30px;padding:0 8px;border:none;background:0 0;border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:18px;font-weight:600;text-align:left;cursor:pointer}
.wscb-grouphead:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wscb-gchev{display:inline-flex;align-items:center;justify-content:center;width:16px;flex:none;transition:transform .15s var(--ds-ease-in-out);opacity:.9}
.wscb-gname{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
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
.wscb-title{flex:1;min-width:0;font-size:14px;line-height:20px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wscb-count{flex:none;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.wscb-sessionrow{box-sizing:border-box;display:flex;align-items:center;height:32px;padding:0 8px;border-radius:var(--dsw-radius-md);color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none;outline:none}
.wscb-sessionrow:hover{background:var(--dsw-alias-interactive-bg-hover)}
.wscb-sessionrow:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.wscb-sessionrow .wscb-title{flex:1;margin:0 6px 0 4px;font-size:13px}
.wscb-slot{display:inline-flex;align-items:center;justify-content:center;width:16px;height:20px;flex:none;color:var(--dsw-alias-label-tertiary)}
.wscb-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary))}
.wscb-time{flex:none;font-size:10px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.wscb-rowactions{display:none;flex:none;align-items:center;gap:6px}
.wscb-sessionrow:hover .wscb-time{display:none}
.wscb-sessionrow:hover .wscb-rowactions{display:inline-flex}
.wscb-icon-sm{width:20px;height:20px}
.wscb-more{display:block;height:28px;margin-left:24px;padding:0 8px;border:none;background:0 0;border-radius:var(--dsw-radius-sm);color:var(--dsw-alias-label-tertiary);font-family:inherit;font-size:12px;line-height:18px;text-align:left;cursor:pointer}
.wscb-more:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.wscb-empty{margin:0 0 2px 24px;padding:4px 8px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary);border:1px dashed var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-sm)}
.wscb-hint{margin:2px 8px 6px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
.wscb-drop{box-shadow:inset 0 0 0 1px var(--dsw-alias-state-business-primary,var(--dsw-alias-brand-primary));border-radius:var(--dsw-radius-md)}
`;

    // #region category panel

    function createPanel(services) {
      return function WorkspaceCategoriesPanel(props) {
        const t = React.useMemo(() => createTranslate(props.t), [props.t]);
        const useWorkspaces = props.useWorkspaces;
        const snapshot = typeof useWorkspaces === 'function' ? useWorkspaces((state) => state) : null;
        const items = (snapshot && Array.isArray(snapshot.items)) ? snapshot.items : [];
        const loading = snapshot === null || snapshot === undefined
          || (snapshot.phase !== 'ready' && items.length === 0);

        const state = useStore();
        const [query, setQuery] = React.useState('');
        const [editing, setEditing] = React.useState(null);
        const [dragId, setDragId] = React.useState(null);
        const [dropCat, setDropCat] = React.useState(null);
        const [confirmId, setConfirmId] = React.useState(null);

        const categories = state.categories;
        const categoryIds = React.useMemo(() => new Set(categories.map((row) => row.id)), [categories]);

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

        const body = [];
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
            body.push(h('section', { key: '__loose', className: 'wsc-card' },
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

        return h('div', { className: 'wsc-root' },
          h('style', { key: 'css' }, PANEL_CSS),
          h('div', { className: 'wsc-head' },
            h('div', { className: 'wsc-titlerow' },
              h('div', { className: 'wsc-grow' },
                h('h1', { className: 'wsc-title' }, t('panel.title')),
                h('p', { className: 'wsc-sub' }, t('panel.subtitle')),
              ),
              h('span', { className: 'wsc-chip' }, t('panel.count', { n: items.length })),
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
            color: 'var(--dsw-alias-label-caption)',
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
              className: 'wscb-projectrow',
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
              h('span', { className: 'wscb-title' }, nameOf(row)),
              h('span', { className: 'wscb-count' }, String(sessions.length)),
            ),
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

        return h('div', { className: 'wscb-root' },
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

      const services = {
        showConversation: () => ctx.layout.selectPanel(null),
        openPanel: () => ctx.layout.selectPanel(PANEL_ID),
        openSession: (sessionId) => ctx.uiWorkspace.openSession(sessionId),
        openWorkspace: (workspaceId) => ctx.uiWorkspace.openWorkspace(workspaceId),
        pickDirectory: () => ctx.uiWorkspace.pickDirectory(),
        createWorkspace: (input) => ctx.workspaces.create(input),
        archiveSession: (sessionId) => ctx.workspaces.archiveSession(sessionId),
      };

      const Panel = createPanel(services);
      const Sidebar = createSidebarBrowser(services);

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
