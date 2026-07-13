import { useEffect, useState } from 'react';
import { Image } from 'antd';
import { bookCover, fetchBookCover, isPlaceholderCover } from '@/utils/cover';

interface BookCoverProps {
  title: string;
  isbn?: string;
  /** 初始封面（可作为加载占位），占位图会被真实封面替换 */
  cover?: string;
  width?: number;
  height?: number;
}

/** 按书名匹配真实封面的图书封面组件 */
export default function BookCover({ title, isbn, cover, width = 40, height = 56 }: BookCoverProps) {
  const [src, setSrc] = useState<string>(cover && !isPlaceholderCover(cover) ? cover : bookCover(title));

  useEffect(() => {
    let alive = true;
    fetchBookCover(title, isbn).then((url) => {
      if (alive) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [title, isbn]);

  return <Image src={src} width={width} height={height} className="rounded object-cover" preview={false} />;
}
