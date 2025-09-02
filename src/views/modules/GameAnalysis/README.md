# Dota2 数据分析模块 - OpenDota API 集成

## 概述

本模块已从读取本地数据改为调用 OpenDota API 获取实时的 Dota2 比赛数据。

## 主要变更

### 1. 数据源变更

- **之前**: 读取本地 JSON 文件 (`yyy.json`, `zjj.json`)
- **现在**: 调用 OpenDota API (`https://api.opendota.com/api/players/{account_id}/matches`)

### 2. 用户配置

需要在 `src/views/modules/GameAnalysis/index.vue` 中配置实际的 Dota2 账户 ID：

```javascript
const users = [
  { label: 'YYY', value: '123456789' }, // 替换为实际的 account_id
  { label: 'ZJJ', value: '987654321' }, // 替换为实际的 account_id
];
```

### 3. 如何获取 Account ID

1. 访问 [OpenDota](https://www.opendota.com/)
2. 搜索玩家的 Steam 用户名或 Steam ID
3. 在玩家页面的 URL 中可以找到 Account ID
   - 例如：`https://www.opendota.com/players/123456789`
   - 其中 `123456789` 就是 Account ID

## 功能特性

### 1. 实时数据获取

- 自动从 OpenDota API 获取玩家近期比赛数据
- 支持错误处理和重试机制
- 显示加载状态和错误提示

### 2. 数据转换

- 将 OpenDota API 数据格式转换为项目内部使用的格式
- 自动计算每日游戏统计（总局数、胜场数、败场数、胜率）
- 生成对应的颜色编码

### 3. 胜负判断逻辑

```javascript
// 根据 radiant_win 和 player_slot 判断胜负
const isRadiant = match.player_slot < 128;
const isWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
```

### 4. 数据聚合

- 按日期分组统计比赛数据
- 计算每日胜率和游戏局数
- 保持与原有数据结构的兼容性

## API 数据结构

### OpenDota API 返回格式

```json
[
  {
    "match_id": 3703866531,
    "player_slot": 0,
    "radiant_win": true,
    "duration": 0,
    "game_mode": 0,
    "lobby_type": 0,
    "hero_id": 0,
    "start_time": 0,
    "version": 0,
    "kills": 0,
    "deaths": 0,
    "assists": 0,
    "skill": 0,
    "average_rank": 0,
    "leaver_status": 0,
    "party_size": 0,
    "hero_variant": 0
  }
]
```

### 转换后的内部格式

```json
{
  "calendar": [
    {
      "data": [
        {
          "date": "1720108800",
          "count": "4",
          "win_count": "3",
          "lose_count": "1",
          "win_rate": "75.0%",
          "count_color": "#7F92A525",
          "win_color": "#C0C21E"
        }
      ]
    }
  ]
}
```

## 错误处理

### 1. API 请求失败

- 显示具体的错误信息
- 提供重试按钮
- 记录错误日志到控制台

### 2. 数据格式错误

- 验证 API 返回数据的格式
- 处理空数据或无效数据的情况
- 提供友好的错误提示

### 3. 网络问题

- 处理网络超时和连接失败
- 显示加载状态指示器
- 支持手动重试

## 使用步骤

1. **配置账户 ID**: 在代码中替换为实际的 Dota2 账户 ID
2. **选择玩家**: 在界面上选择要查看的玩家
3. **等待加载**: 系统会自动从 API 获取数据
4. **查看数据**: 数据加载完成后会显示年份选择器和图表

## 注意事项

1. **API 限制**: OpenDota API 可能有请求频率限制，请合理使用
2. **数据范围**: API 返回的是玩家的历史比赛数据，通常包含近期的比赛
3. **网络依赖**: 需要稳定的网络连接才能正常获取数据
4. **隐私设置**: 如果玩家的 Steam 资料设为私有，可能无法获取数据

## 开发说明

### 主要函数

- `fetchPlayerMatches(accountId)`: 调用 OpenDota API 获取比赛数据
- `transformApiDataToLocalFormat(matches)`: 转换 API 数据格式
- `getCountColor(count)`: 根据游戏局数生成颜色
- `getWinColor(winRate)`: 根据胜率生成颜色
- `handleUserChange()`: 处理用户切换事件

### 状态管理

- `loading`: 控制加载状态显示
- `error`: 存储错误信息
- `selectedUser`: 当前选择的用户账户 ID
- `processedData`: 处理后的游戏数据

## 测试建议

1. 使用有效的 Account ID 进行测试
2. 测试网络异常情况下的错误处理
3. 验证数据转换的正确性
4. 检查不同胜率和局数下的颜色显示
