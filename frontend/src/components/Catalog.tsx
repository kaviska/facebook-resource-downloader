'use client';

import { useState } from 'react';

interface Block {
  style: string;
  _key: string;
  children: { text: string }[];
}

interface Blog {
  body: Block[];
}

export default function Catalog({ blog }: { blog: Blog[] }) {
  const blocks = blog[0]?.body || [];

  // Step 1: Nest h3s under corresponding h2s
  const toc: { h2: Block; h3s: Block[] }[] = [];
  let currentH2: { h2: Block; h3s: Block[] } | null = null;

  for (const block of blocks) {
    if (block.style === 'h2') {
      currentH2 = { h2: block, h3s: [] };
      toc.push(currentH2);
    } else if (block.style === 'h3' && currentH2) {
      currentH2.h3s.push(block);
    }
  }

  // State to manage visibility of h3s for each h2
  const [visibleH3s, setVisibleH3s] = useState<{ [key: string]: boolean }>({});

  const toggleH3Visibility = (key: string) => {
    setVisibleH3s((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

   return (
    <div className="flex flex-col gap-1 font-medium text-[14px] bg-gray-50 p-4 rounded-md shadow-md">
      <h3 className="font-semibold mb-3 text-[18px] text-gray-800">Table of Contents</h3>
  
      {toc.map((item, i) => (
        <div key={i} className="mb-2">
          {/* h2 */}
          <div className="flex items-center gap-2">
            {item.h3s.length > 0 && (
              <button
                onClick={() => toggleH3Visibility(item.h2._key)}
                className="text-[14px] text-blue-700 hover:text-blue-500 cursor-pointer focus:outline-none"
                aria-label={`Toggle visibility of subheadings for ${item.h2.children.map((child) => child.text).join(' ')}`}
              >
                {visibleH3s[item.h2._key] ? '-' : '+'}
              </button>
            )}
            <div
              onClick={() => {
                const el = document.getElementById(item.h2._key);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-blue-700 hover:text-blue-500 cursor-pointer text-[14px] font-semibold"
            >
              {item.h2.children.map((child) => child.text).join(' ')}
            </div>
          </div>
  
          {/* h3s */}
          {visibleH3s[item.h2._key] && item.h3s.length > 0 && (
            <div className="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-3">
              {item.h3s.map((h3, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const el = document.getElementById(h3._key);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-blue-500 hover:text-blue-400 cursor-pointer text-[12px]"
                >
                  {h3.children.map((child) => child.text).join(' ')}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}