(() => {
  const json = (body) =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  const demoUser = {
    id: "vendeflow-demo",
    nickname: "Vendeflow Demo",
    email: "demo@vendeflow.local",
    avatar: "",
    language: "Chinese",
  };

  const mocks = [
    {
      test: (path) => path === "/v1/user/info",
      body: { code: 0, data: demoUser },
    },
    {
      test: (path) => path === "/v1/user/tenant_info",
      body: {
        code: 0,
        data: {
          tenant_id: "vendeflow-demo",
          name: "Vendeflow Demo",
          llm_id: "",
          embd_id: "",
          asr_id: "",
          img2txt_id: "",
          rerank_id: "",
        },
      },
    },
    {
      test: (path) => path === "/v1/tenant/list",
      body: { code: 0, data: [] },
    },
    {
      test: (path) => path === "/v1/kb/list",
      body: { code: 0, data: { kbs: [], total: 0 } },
    },
    {
      test: (path) => path === "/v1/dialog/next",
      body: { code: 0, data: { dialogs: [], total: 0 } },
    },
    {
      test: (path) => path.startsWith("/v1/"),
      body: { code: 0, data: {} },
    },
  ];

  const findMock = (rawUrl) => {
    if (rawUrl) {
      const url = new URL(rawUrl, window.location.origin);
      const matched = mocks.find((item) => item.test(url.pathname));
      if (matched) return matched.body;
    }
    return null;
  };

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const rawUrl = typeof input === "string" ? input : input?.url;
    const matched = findMock(rawUrl);
    if (matched) return Promise.resolve(json(matched));
    return nativeFetch(input, init);
  };

  const NativeXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function StaticDemoXHR() {
    const xhr = new NativeXHR();
    let requestUrl = "";

    const nativeOpen = xhr.open;
    xhr.open = function open(method, url, ...rest) {
      requestUrl = url;
      return nativeOpen.call(xhr, method, url, ...rest);
    };

    const nativeSend = xhr.send;
    xhr.send = function send(body) {
      const matched = findMock(requestUrl);
      if (!matched) return nativeSend.call(xhr, body);

      const payload = JSON.stringify(matched);
      Object.defineProperty(xhr, "readyState", { value: 4, configurable: true });
      Object.defineProperty(xhr, "status", { value: 200, configurable: true });
      Object.defineProperty(xhr, "statusText", { value: "OK", configurable: true });
      Object.defineProperty(xhr, "responseText", { value: payload, configurable: true });
      Object.defineProperty(xhr, "response", { value: payload, configurable: true });
      setTimeout(() => {
        xhr.onreadystatechange?.();
        xhr.onload?.();
        xhr.onloadend?.();
      }, 0);
    };

    return xhr;
  };
})();
