/**
 * 测试数据转换功能
 * 用于验证 OpenDota API 数据转换是否正确
 */

// 模拟 OpenDota API 返回的数据
const mockApiData = [
  {
    match_id: 7000000001,
    player_slot: 0, // 天辉方
    radiant_win: true, // 天辉胜利
    start_time: 1720108800, // 2024-07-05 00:00:00
    duration: 1800,
    kills: 10,
    deaths: 3,
    assists: 15
  },
  {
    match_id: 7000000002,
    player_slot: 1, // 天辉方
    radiant_win: false, // 天辉失败
    start_time: 1720112400, // 2024-07-05 01:00:00
    duration: 2100,
    kills: 5,
    deaths: 8,
    assists: 12
  },
  {
    match_id: 7000000003,
    player_slot: 128, // 夜魇方 (128+)
    radiant_win: true, // 天辉胜利，夜魇失败
    start_time: 1720116000, // 2024-07-05 02:00:00
    duration: 1500,
    kills: 3,
    deaths: 12,
    assists: 5
  },
  {
    match_id: 7000000004,
    player_slot: 130, // 夜魇方
    radiant_win: false, // 天辉失败，夜魇胜利
    start_time: 1720195200, // 2024-07-06 00:00:00
    duration: 2400,
    kills: 15,
    deaths: 2,
    assists: 20
  }
];

// 数据转换函数（从主文件复制）
const transformApiDataToLocalFormat = (matches) => {
  if (!matches || !Array.isArray(matches)) {
    return { calendar: [] };
  }

  // 按日期分组统计
  const dailyStats = {};
  
  matches.forEach(match => {
    const startTime = match.start_time;
    const dateKey = Math.floor(startTime / 86400) * 86400; // 转换为当天0点的时间戳
    
    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = {
        date: dateKey.toString(),
        count: 0,
        win_count: 0,
        lose_count: 0,
        matches: []
      };
    }
    
    dailyStats[dateKey].count++;
    dailyStats[dateKey].matches.push(match);
    
    // 判断胜负：根据 radiant_win 和 player_slot 判断
    const isRadiant = match.player_slot < 128;
    const isWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
    
    if (isWin) {
      dailyStats[dateKey].win_count++;
    } else {
      dailyStats[dateKey].lose_count++;
    }
  });

  // 转换为项目期望的格式
  const calendarData = Object.values(dailyStats).map(dayData => {
    const winRate = dayData.count > 0 ? (dayData.win_count / dayData.count * 100).toFixed(1) : '0.0';
    
    return {
      date: dayData.date,
      count: dayData.count.toString(),
      win_count: dayData.win_count.toString(),
      lose_count: dayData.lose_count.toString(),
      win_rate: `${winRate}%`,
      // 生成颜色（可以根据需要调整颜色逻辑）
      count_color: getCountColor(dayData.count),
      win_color: getWinColor(parseFloat(winRate))
    };
  });

  return {
    calendar: [{
      data: calendarData
    }]
  };
};

// 颜色生成函数
const getCountColor = (count) => {
  if (count === 0) return '#0CFFFFFF';
  if (count <= 3) return '#4C92A525';
  if (count <= 6) return '#7F92A525';
  return '#CC92A525';
};

const getWinColor = (winRate) => {
  if (winRate === 0) return '#C23C2A';
  if (winRate < 30) return '#F37A40';
  if (winRate < 40) return '#F29731';
  if (winRate < 50) return '#F1B224';
  if (winRate < 60) return '#EFCC16';
  if (winRate < 70) return '#C0C21E';
  if (winRate < 80) return '#92A525';
  if (winRate < 90) return '#8FB725';
  return '#60AD2C';
};

// 运行测试
console.log('=== 测试数据转换功能 ===');
console.log('输入数据:', mockApiData);

const result = transformApiDataToLocalFormat(mockApiData);
console.log('转换结果:', JSON.stringify(result, null, 2));

// 验证结果
const calendarData = result.calendar[0].data;
console.log('\n=== 验证结果 ===');
console.log(`总共 ${calendarData.length} 天的数据`);

calendarData.forEach((day, index) => {
  console.log(`第 ${index + 1} 天:`);
  console.log(`  日期: ${new Date(parseInt(day.date) * 1000).toLocaleDateString()}`);
  console.log(`  总局数: ${day.count}`);
  console.log(`  胜场: ${day.win_count}`);
  console.log(`  败场: ${day.lose_count}`);
  console.log(`  胜率: ${day.win_rate}`);
  console.log(`  局数颜色: ${day.count_color}`);
  console.log(`  胜率颜色: ${day.win_color}`);
  console.log('');
});

// 预期结果验证
console.log('=== 预期结果验证 ===');
console.log('2024-07-05 应该有 3 局游戏，2 胜 1 负，胜率 66.7%');
console.log('2024-07-06 应该有 1 局游戏，1 胜 0 负，胜率 100.0%');

export { transformApiDataToLocalFormat, getCountColor, getWinColor };
