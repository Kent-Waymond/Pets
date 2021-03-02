import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Button from '../button';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { TABLE_PAGE_SIZE } from '@/variable';

export interface IPaginationProps {
  current: number;
  total: number;
  simple?: boolean;
  pageSize?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showPageJumper?: boolean;
  // onChange
  onChange?: (current: number, size: number) => void;
}

interface IPaginationOption {
  pageSize: number;
  pageSizeOptions: number[];
}

const DEFAULT_PAGINATION_OPTION: IPaginationOption = {
  pageSize: TABLE_PAGE_SIZE || 20,
  pageSizeOptions: [5, 10, 20, 50, 100],
};

export function Pagination(props: IPaginationProps) {
  const {
    current,
    pageSize,
    total,
    simple,
    showPageJumper,
    showSizeChanger,
    pageSizeOptions,
    onChange,
  } = props;
  const [currentPage, ChangeCurrentPage] = useState<number>(1);
  const [currentPageSize, ChangeCurrentPageSize] = useState<number>(20);

  const PaginationPageRecord = useRef<any>();
  // 计算生成分页配置
  const PaginationOption: IPaginationOption = useMemo(() => {
    return {
      ...DEFAULT_PAGINATION_OPTION,
      pageSize: pageSize ?? DEFAULT_PAGINATION_OPTION.pageSize,
      pageSizeOptions:
        pageSizeOptions ?? DEFAULT_PAGINATION_OPTION.pageSizeOptions,
    };
  }, [pageSize, pageSizeOptions]);

  // 生成总页数
  const PagesCount = useMemo(() => {
    const { pageSize } = PaginationOption;
    // console.log("wqqq ", pageSize, total)
    const totalPages =
      total % pageSize === 0
        ? total / pageSize
        : Math.floor(total / pageSize) + 1;
    return totalPages;
  }, [PaginationOption, total]);

  useEffect(() => {
    if (typeof current === 'number' && current > 0 && current <= PagesCount) {
      ChangeCurrentPage(current);
    }
  }, [current, PagesCount]);

  useEffect(() => {
    if (typeof pageSize === 'number' && pageSize > 0) {
      ChangeCurrentPageSize(pageSize);
    }
  }, [pageSize]);

  function getLegalPageNumber(page: number) {
    let currentpage = Number(page);
    if (currentpage < 1) {
      currentpage = 1;
    }
    if (currentpage > PagesCount) {
      currentpage = PagesCount;
    }
    return currentpage;
  }

  function onSizeChangerChange(ev: ChangeEvent<HTMLSelectElement>) {
    const value = ev.target.value;
    // console.log("pagesize changer size ", value)
    const currentSize = Number(value) || 20;
    ChangeCurrentPageSize(currentSize);

    if (onChange) {
      onChange(currentPage, currentSize);
    }
  }

  function onPageInputChange(ev: ChangeEvent<HTMLInputElement>) {
    const value = ev.target.value;
    if (value === '' || value === '0') {
      PaginationPageRecord.current = currentPage;
    }
    ChangeCurrentPage(value as any);
  }
  function onPageBlur(ev: React.FocusEvent<HTMLInputElement>) {
    let currentpage = currentPage;
    if (!currentPage) {
      currentpage = PaginationPageRecord.current;
    } else {
      currentpage = getLegalPageNumber(currentPage);
    }
    ChangeCurrentPage(currentpage);

    if (onChange) {
      onChange(currentpage, currentPageSize);
    }
  }

  function onPageKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key == 'Enter') {
      let currentpage = getLegalPageNumber(currentPage);
      ChangeCurrentPage(currentpage);

      if (onChange) {
        onChange(currentpage, currentPageSize);
      }
    }
  }

  function handlePagePrev(ev: React.MouseEvent<HTMLElement, MouseEvent>) {
    const prevPage = currentPage > 1 ? currentPage - 1 : 1;
    ChangeCurrentPage(prevPage);

    if (onChange) {
      onChange(prevPage, currentPageSize);
    }
  }

  function handlePageNext(ev: React.MouseEvent<HTMLElement, MouseEvent>) {
    const nextPage = currentPage < PagesCount ? currentPage + 1 : PagesCount;
    ChangeCurrentPage(nextPage);

    if (onChange) {
      onChange(nextPage, currentPageSize);
    }
  }

  if (simple) {
    return (
      <ul className="pagination pagination-lite">
        <li className="pagination-item">
          <Button
            icon={<LeftOutlined />}
            disabled={currentPage <= 1}
            onClick={handlePagePrev}
          />
        </li>

        <li className="pagination-item">
          {showPageJumper ? (
            <input
              size={3}
              value={currentPage}
              onChange={onPageInputChange}
              onKeyDown={onPageKeyDown}
              onBlur={onPageBlur}
            />
          ) : (
            <>{currentPage}</>
          )}
        </li>
        <li className="pagination-item">/</li>
        <li className="pagination-item">{PagesCount}</li>
        {/* <div className="pagination-item">
          {
            `${currentPage} / ${PagesCount}`
          }
        </div> */}
        <li className="pagination-item">
          <Button
            icon={<RightOutlined />}
            disabled={currentPage >= PagesCount}
            onClick={handlePageNext}
          />
        </li>
        {showSizeChanger && (
          <li className="pagination-item">
            <select value={currentPageSize} onChange={onSizeChangerChange}>
              {PaginationOption.pageSizeOptions?.map((item: number) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </li>
        )}
      </ul>
    );
  }

  return null;
}
