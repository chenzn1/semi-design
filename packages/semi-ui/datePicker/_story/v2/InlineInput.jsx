import React from 'react';
import { DatePicker, Space } from '@douyinfe/semi-ui';

/**
 * Test with Chromatic
 */
export default function App() {
    const props = {
        defaultOpen: true,
        motion: false,
        inlineInput: true
    };
    const spacing = [200, 400];
    // 使用过去的时间，避免当前日变动引入 UI 测试失败
    return (
        <div style={{ height: '100vh' }}>
            <Space wrap spacing={spacing}>
                <DatePicker {...props} />
                <DatePicker {...props} type='dateTime' />
                <DatePicker {...props} position='leftTopOver' multiple inputReadOnly />
                <DatePicker {...props} type='dateRange' defaultOpen={false} />
                <DatePicker {...props} type='dateTimeRange' defaultOpen={false} />
            </Space>
        </div>
    );
}

App.parameters = {
    chromatic: {
        disableSnapshot: false,
        delay: 3000,
        viewports: [1800]
    },
};
App.storyName = 'inline input';