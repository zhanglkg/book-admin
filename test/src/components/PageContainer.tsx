import type { ReactNode } from 'react';
import { Typography } from 'antd';

interface PageContainerProps {
  title: string;
  description?: string;
  /** 右侧操作区（如「新增」按钮） */
  extra?: ReactNode;
  /** 内容区下额外固定区域（如搜索栏） */
  headerExtra?: ReactNode;
  children: ReactNode;
}

/** 通用页面容器：标题 + 描述 + 操作区 + 白色内容卡片 */
export default function PageContainer({ title, description, extra, headerExtra, children }: PageContainerProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Typography.Title level={4} className="!mb-0 !text-[20px] !font-semibold !text-[#1F1F1F]">
            {title}
          </Typography.Title>
          {description && <p className="!mb-0 !mt-1 text-[13px] text-[#8c8c8c]">{description}</p>}
        </div>
        {extra && <div className="flex items-center gap-2">{extra}</div>}
      </div>
      {headerExtra}
      <div className="rounded-lg border border-[#f0f0f0] bg-white p-5 shadow-sm">{children}</div>
    </div>
  );
}
