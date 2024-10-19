import { useEffect, useRef, useState } from 'react';
import './index.css';
import { MOCKDATA_LENGTH, PER_PAGE, getMockData } from './mockData';
import LoadingSpinner from './LoadingSpinner';
import { BookmarkBorderOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

interface Product {
  productId: string;
  productName: string;
  price: number;
  boughtDate: string;
}

function App() {
  const [productData, setProductData] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const observerRoot = useRef();
  const loadMoreTrigger = useRef();

  const fetchProductData = async (page: number) => {
    setIsDataLoading(true);
    setIsLoaded(false);
    const data = await getMockData(page);

    setProductData([...productData, ...data.datas]);
    setIsLoaded(true);
    setIsDataLoading(false);
  };

  useEffect(() => {
    if (page < MOCKDATA_LENGTH / PER_PAGE) fetchProductData(page);
  }, [page]);

  console.table(productData);

  const options = {
    root: observerRoot.current,
    threshold: 0.1, // 타겟 요소의 10%가 루트 요소와 겹치면 콜백 실행
  };

  useEffect(() => {
    if (isLoaded) {
      //로딩되었을 때만 실행
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isDataLoading) {
          setPage((prev) => prev + 1);
        }
      }, options);
      //옵저버 탐색 시작
      observer.observe(loadMoreTrigger.current);

      return () => {
        observer.disconnect(); // 컴포넌트 언마운트 시 옵저버 해제
      };
    }
  }, [isLoaded, isDataLoading]);

  function getRandomPastelColor() {
    const red = Math.floor(Math.random() * 128) + 127;
    const green = Math.floor(Math.random() * 128) + 127;
    const blue = Math.floor(Math.random() * 128) + 127;

    return `rgb(${red}, ${green}, ${blue})`;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-black h-screen">
      <div>{isLoaded ? null : <LoadingSpinner />}</div>
      <div className="flex justify-between bg-white w-96 p-3">
        <div className="flex items-center justify-center bg-gray-100 w-3/4 rounded pl-2">
          <SearchOutlined style={{ fontSize: '20px' }} />
          <input placeholder="쇼핑 검색" className="bg-gray-100 w-full p-1 focus:outline-none" />
        </div>
        <div className="mx-2">
          <BookmarkBorderOutlined style={{ fontSize: '24px', marginRight: '15px' }} />
          <ShoppingCartOutlined style={{ fontSize: '24px' }} />
        </div>
      </div>
      <div ref={observerRoot} className="bg-white h-full w-96 overflow-auto p-4 scrollbar-hide">
        <div className=" grid grid-cols-2 gap-2">
          {productData?.map((product) => {
            const randomPastelColor = getRandomPastelColor();
            return (
              <div>
                <div
                  className="w-[170px] h-[150px] rounded"
                  style={{
                    background: randomPastelColor,
                  }}
                />
                <div>{product.productName}</div>
                <div className="font-semibold mb-2">￦ {product.price.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
        <div ref={loadMoreTrigger} />
      </div>
      <div className="bg-white w-96 p-3 border-t border-gray-300">
        TOTAL : ￦ {productData.reduce((ac, cu) => ac + cu.price, 0).toLocaleString()}
      </div>
    </div>
  );
}

export default App;
