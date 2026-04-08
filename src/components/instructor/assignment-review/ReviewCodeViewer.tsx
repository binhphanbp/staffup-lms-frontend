import React from 'react';

export const ReviewCodeViewer = () => {
  return (
    <div className="z-0 flex h-full min-w-0 flex-1 flex-col bg-[var(--color-code-bg)]">
      <div className="dark-scrollbar flex flex-shrink-0 overflow-x-auto border-b border-black/40 bg-[#21252b]">
        <button className="file-tab active border-t-primary flex min-w-max items-center gap-2 border-t-2 border-r border-white/5 bg-[#282c34] px-4 py-2.5 font-mono text-[12px] text-slate-200">
          <i className="fa-brands fa-golang text-blue-400"></i> rate_limiter.go
        </button>
        <button className="file-tab flex min-w-max items-center gap-2 border-t-2 border-r border-white/5 border-t-transparent px-4 py-2.5 font-mono text-[12px] text-slate-400 transition-colors hover:bg-[#282c34] hover:text-slate-200">
          <i className="fa-brands fa-golang text-blue-400"></i> main_test.go
        </button>
      </div>

      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/5 bg-[#282c34] px-4 py-2 text-slate-400">
        <div className="font-mono text-[11px]">
          <span className="text-success">
            <i className="fa-solid fa-check-circle"></i> 5/5 Test Passed
          </span>
          <span className="mx-2">|</span>
          <span>102 lines</span>
        </div>
        <div className="flex gap-3 text-[12px]">
          <button className="transition-colors hover:text-white" title="Đóng gói">
            <i className="fa-solid fa-compress"></i>
          </button>
          <button className="transition-colors hover:text-white" title="Tìm kiếm">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div className="dark-scrollbar relative flex flex-1 overflow-y-auto pb-20 font-mono text-[13px] text-[var(--color-code-text)]">
        <div className="line-numbers w-12 flex-shrink-0 border-r border-white/5 bg-[#282c34] pt-2 pr-3 text-right text-[12px] text-[#4b5263]">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i}></div>
          ))}
        </div>

        <div className="dark-scrollbar flex-1 overflow-x-auto pt-2 pl-4 whitespace-pre">
          <div className="code-line">
            <span className="text-[var(--color-code-keyword)]">package</span> main
          </div>
          <div className="code-line"></div>
          <div className="code-line">
            <span className="text-[var(--color-code-keyword)]">import</span> (
          </div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-string)]">&quot;sync&quot;</span>
          </div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-string)]">&quot;time&quot;</span>
          </div>
          <div className="code-line">)</div>
          <div className="code-line"></div>
          <div className="code-line">
            <span className="text-[var(--color-code-comment)]">{`// TokenBucket implements rate limiting algorithm`}</span>
          </div>
          <div className="code-line">
            <span className="text-[var(--color-code-keyword)]">type</span>{' '}
            <span className="text-[var(--color-code-type)]">TokenBucket</span>{' '}
            <span className="text-[var(--color-code-keyword)]">struct</span> {`{`}
          </div>
          <div className="code-line">
            {' '}
            capacity <span className="text-[var(--color-code-type)]">int</span>
          </div>
          <div className="code-line">
            {' '}
            tokens <span className="text-[var(--color-code-type)]">int</span>
          </div>
          <div className="code-line">
            {' '}
            refillRate <span className="text-[var(--color-code-type)]">time.Duration</span>
          </div>
          <div className="code-line">
            {' '}
            lastRefill <span className="text-[var(--color-code-type)]">time.Time</span>
          </div>
          <div className="code-line">
            {' '}
            mu <span className="text-[var(--color-code-type)]">sync.Mutex</span>
          </div>
          <div className="code-line">{`}`}</div>
          <div className="code-line"></div>
          <div className="code-line">
            <span className="text-[var(--color-code-keyword)]">func</span>{' '}
            <span className="text-[var(--color-code-function)]">NewTokenBucket</span>(capacity{' '}
            <span className="text-[var(--color-code-type)]">int</span>, rate{' '}
            <span className="text-[var(--color-code-type)]">time.Duration</span>) *
            <span className="text-[var(--color-code-type)]">TokenBucket</span> {`{`}
          </div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-keyword)]">return</span> &amp;
            <span className="text-[var(--color-code-type)]">TokenBucket</span>
            {`{`}
          </div>
          <div className="code-line"> capacity: capacity,</div>
          <div className="code-line"> tokens: capacity,</div>
          <div className="code-line"> refillRate: rate,</div>
          <div className="code-line">
            {' '}
            lastRefill: time.<span className="text-[var(--color-code-function)]">Now</span>(),
          </div>
          <div className="code-line"> {`}`}</div>
          <div className="code-line">{`}`}</div>
          <div className="code-line"></div>
          <div className="code-line">
            <span className="text-[var(--color-code-keyword)]">func</span> (tb *
            <span className="text-[var(--color-code-type)]">TokenBucket</span>){' '}
            <span className="text-[var(--color-code-function)]">Allow</span>(){' '}
            <span className="text-[var(--color-code-type)]">bool</span> {`{`}
          </div>
          <div className="code-line">
            {' '}
            tb.mu.<span className="text-[var(--color-code-function)]">Lock</span>()
          </div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-keyword)]">defer</span> tb.mu.
            <span className="text-[var(--color-code-function)]">Unlock</span>()
          </div>
          <div className="code-line"></div>
          <div className="code-line">
            {' '}
            now := time.<span className="text-[var(--color-code-function)]">Now</span>()
          </div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-comment)]">{`// Tính toán số token được refill từ lần gọi cuối`}</span>
          </div>
          <div className="code-line">
            {' '}
            elapsed := now.<span className="text-[var(--color-code-function)]">Sub</span>
            (tb.lastRefill)
          </div>
          <div className="code-line">
            {' '}
            tokensToAdd := <span className="text-[var(--color-code-function)]">int</span>(elapsed /
            tb.refillRate)
          </div>

          <div className="inline-comment relative shadow-lg">
            <div className="mb-1 flex items-center justify-between">
              <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-white">
                You (Instructor)
              </span>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-white">
                  <i className="fa-solid fa-pen text-[10px]"></i>
                </button>
                <button className="hover:text-danger text-slate-400">
                  <i className="fa-solid fa-trash text-[10px]"></i>
                </button>
              </div>
            </div>
            <div className="font-sans text-[12px] leading-relaxed whitespace-normal text-slate-300">
              Hải Nam lưu ý: Việc ép kiểu <code>int(elapsed / tb.refillRate)</code> có thể gây ra
              sai số nhỏ do làm tròn xuống. Ở hệ thống thực tế (High throughput) chúng ta thường lưu
              token dưới dạng số thực (float64) hoặc lưu timestamp chính xác hơn.
            </div>
          </div>

          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-keyword)]">if</span> tokensToAdd &gt;{' '}
            <span className="text-[var(--color-code-number)]">0</span> {`{`}
          </div>
          <div className="code-line"> tb.tokens += tokensToAdd</div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-keyword)]">if</span> tb.tokens &gt; tb.capacity{' '}
            {`{`}
          </div>
          <div className="code-line"> tb.tokens = tb.capacity</div>
          <div className="code-line"> {`}`}</div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-comment)]">{`// Cập nhật lại thời gian theo số token đã cộng, tránh trôi dạt`}</span>
          </div>
          <div className="code-line">
            {' '}
            tb.lastRefill = tb.lastRefill.
            <span className="text-[var(--color-code-function)]">Add</span>(time.
            <span className="text-[var(--color-code-type)]">Duration</span>(tokensToAdd) *
            tb.refillRate)
          </div>
          <div className="code-line"> {`}`}</div>
          <div className="code-line"></div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-keyword)]">if</span> tb.tokens &gt;{' '}
            <span className="text-[var(--color-code-number)]">0</span> {`{`}
          </div>
          <div className="code-line"> tb.tokens--</div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-keyword)]">return true</span>
          </div>
          <div className="code-line"> {`}`}</div>
          <div className="code-line">
            {' '}
            <span className="text-[var(--color-code-keyword)]">return false</span>
          </div>
          <div className="code-line">{`}`}</div>
        </div>
      </div>
    </div>
  );
};
