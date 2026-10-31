import { SITE, WILAYAS } from "@/lib/constants";

export type PrintOrder = {
  orderNumber: string;
  customerName: string;
  phone: string;
  status?: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  giftCardFee: number;
  giftCard: boolean;
  giftMessage: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  note?: string | null;
  createdAt: string;
  items: { id: string; quantity: number; title: string; price: number }[];
};

export type PrintStrings = {
  receiptTitle: string;
  receiptOrderNumber: string;
  receiptThanks: string;
  receiptDate: string;
  receiptCustomer: string;
  receiptPhone: string;
  receiptAddress: string;
  receiptItems: string;
  receiptSubtotal: string;
  receiptShipping: string;
  receiptFree: string;
  receiptGiftCard: string;
  receiptTotal: string;
  receiptPayment: string;
  receiptPaidOnDelivery: string;
  receiptGiftMessage: string;
  receiptItem: string;
  receiptQty: string;
  receiptUnit: string;
  receiptLineTotal: string;
  receiptFooterBrand: string;
  printLabelTitle: string;
  printLabelReceiver: string;
  printLabelSender: string;
  printLabelAmount: string;
  printLabelItems: string;
  printLabelGift: string;
  printGiftTitle: string;
  printGiftTo: string;
  brand: string;
  brandSub: string;
};

const C = {
  primary: "#1f368f",
  primarySoft: "#eef0fb",
  gold: "#c9a227",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function moldHtml(w: number, h: number, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Border Print</title>
  <style>
    @page { size: ${w}mm ${h}mm; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    HTML, body { width: ${w}mm; height: ${h}mm; background: #fff; font-family: Trebuchet MS, Georgia, sans-serif; color: #14141f; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .wrap { width: 100%; height: 100%; padding: 9mm; }
    @media print { body { width: ${w}mm; height: ${h}mm; } }
  </style></head><body>${body}</body></html>`;
}

function doc(html: string) {
  const win = window.open("", "_blank", "width=640,height=860");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

export function printInvoice(
  order: PrintOrder,
  s: PrintStrings,
  fmt: (n: number) => string,
  dateStr: string,
  locale: string
) {
  const wil = WILAYAS.find((x) => x.code === order.state)?.name ?? order.state ?? "";
  const address = esc([order.street, order.city, wil, order.zip].filter(Boolean).join(", "));
  const items = order.items
    .map((it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${esc(it.title)}</td>
        <td style="text-align:center">${it.quantity}</td>
        <td style="text-align:end">${fmt(it.price)}</td>
        <td style="text-align:end;font-weight:700">${fmt(it.price * it.quantity)}</td>
      </tr>`)
    .join("");
  const giftSection = order.giftCard
    ? `<div style="margin-top:6mm;border:0.6mm dashed ${C.gold};background:${C.gold}08;padding:3mm 4mm;border-radius:2mm">
        <div style="font-size:8px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#5f5f6b">${esc(s.receiptGiftMessage)}</div>
        <div style="margin-top:1.5mm;font-family:Georgia,serif;font-style:italic;font-size:10px">${esc(order.giftMessage ?? "-")}</div>
      </div>`
    : "";
  const body = `
  <div class="wrap" dir="${locale === "ar" ? "rtl" : "ltr"}" style="display:flex;flex-direction:column">
    <div style="background:${C.primary};color:#fff;border-radius:3mm;padding:5mm 6mm;display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-family:Georgia,serif;font-weight:800;font-size:22px;letter-spacing:0.02em;line-height:1">BORDERS</div>
        <div style="margin-top:1.6mm;font-size:7.5px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:${C.gold}">Bookshop</div>
      </div>
      <div style="text-align:end;font-size:8px;line-height:1.55;opacity:.92">
        <div>${esc(SITE.address)}</div>
        <div dir="ltr">${esc(SITE.phone)}</div>
        <div>ruknbooks.dz</div>
      </div>
    </div>
    <div style="margin-top:4mm;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:10.5px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:${C.primary}">${esc(s.receiptTitle)}</span>
      <span style="background:${C.primarySoft};color:${C.primary};border:0.4mm solid ${C.primary}33;border-radius:99px;padding:1mm 3.6mm;font-family:'Courier New',monospace;font-weight:700;font-size:10px">${esc(order.orderNumber)}</span>
    </div>
    <table style="width:100%;margin-top:2.5mm;border-collapse:collapse;font-size:9.5px">
      <tr>
        <td style="padding:1.6mm 0;border-bottom:0.3mm solid #e2e2ea"><div style="font-size:7.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#767684">${esc(s.receiptDate)}</div><div style="font-weight:600">${esc(dateStr)}</div></td>
        <td style="padding:1.6mm 4mm;border-bottom:0.3mm solid #e2e2ea"><div style="font-size:7.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#767684">${esc(s.receiptCustomer)}</div><div style="font-weight:600">${esc(order.customerName)}</div></td>
        <td style="padding:1.6mm 0;border-bottom:0.3mm solid #e2e2ea;text-align:end"><div style="font-size:7.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#767684">${esc(s.receiptPhone)}</div><div dir="ltr" style="font-weight:600">${esc(order.phone)}</div></td>
      </tr>
      <tr><td colspan="3" style="padding:1.8mm 0">
        <div style="font-size:7.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#767684">${esc(s.receiptAddress)}</div>
        <div style="font-weight:600">${address}</div>
      </td></tr>
    </table>
    <table style="width:100%;margin-top:3mm;border-collapse:collapse;font-size:9.5px">
      <thead>
        <tr style="background:${C.primarySoft};color:${C.primary}">
          <th style="padding:2mm;border-radius:1.5mm 0 0 1.5mm;width:6mm">#</th>
          <th style="padding:2mm;text-align:start">${esc(s.receiptItem)}</th>
          <th style="padding:2mm;width:12mm">${esc(s.receiptQty)}</th>
          <th style="padding:2mm;width:22mm;text-align:end">${esc(s.receiptUnit)}</th>
          <th style="padding:2mm;border-radius:0 1.5mm 1.5mm 0;width:26mm;text-align:end">${esc(s.receiptLineTotal)}</th>
        </tr>
      </thead>
      <tbody>${items}</tbody>
    </table>
    <table style="width:100%;margin-top:3.5mm;border-collapse:collapse;font-size:9.5px">
      <tr><td style="color:#767684;padding:1mm 0">${esc(s.receiptSubtotal)}</td><td style="text-align:end;font-weight:600">${fmt(order.subtotal)}</td></tr>
      <tr><td style="color:#767684;padding:1mm 0">${esc(s.receiptShipping)}</td><td style="text-align:end;font-weight:600">${order.shippingFee === 0 ? s.receiptFree : fmt(order.shippingFee)}</td></tr>
      ${order.giftCardFee > 0 ? `<tr><td style="color:#767684;padding:1mm 0">${esc(s.receiptGiftCard)}</td><td style="text-align:end;font-weight:600">${fmt(order.giftCardFee)}</td></tr>` : ""}
    </table>
    <table style="width:100%;margin-top:1.5mm;border-collapse:collapse;background:${C.primarySoft};border-radius:2mm">
      <tr><td style="padding:2.8mm 4mm;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;font-size:10px;color:${C.primary}">${esc(s.receiptTotal)}</td>
      <td style="padding:2.8mm 4mm;text-align:end;font-family:Georgia,serif;font-weight:800;font-size:15px;color:${C.primary}">${fmt(order.total)}</td></tr>
    </table>
    ${giftSection}
    <div style="margin-top:auto;padding-top:4mm">
      <div style="background:#14141f;color:#fff;border-radius:2.5mm;padding:3mm 4.5mm;display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:9px"><span style="font-weight:800">${esc(s.receiptPayment)}:</span> ${esc(s.receiptPaidOnDelivery)}</div>
        <div style="font-size:8px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.gold}">${esc(s.brand)} · ${esc(s.brandSub)}</div>
      </div>
      <div style="margin-top:2.2mm;text-align:center;font-size:8px;color:#767684">${esc(s.receiptThanks)} — ${esc(s.receiptFooterBrand)}</div>
    </div>
  </div>`;
  doc(moldHtml(148, 210, body));
}

export function printShippingLabel(
  order: PrintOrder,
  s: PrintStrings,
  fmt: (n: number) => string,
  locale: string
) {
  const wil = WILAYAS.find((x) => x.code === order.state)?.name ?? order.state ?? "";
  const address = esc([order.street, order.city, wil, order.zip].filter(Boolean).join(", "));
  const body = `
  <div class="wrap" dir="${locale === "ar" ? "rtl" : "ltr"}" style="display:flex;flex-direction:column">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <span style="font-family:Georgia,serif;font-weight:800;font-size:15px;color:${C.primary}">BORDERS</span>
        <span style="margin-inline-start:2mm;font-size:7px;font-weight:700;letter-spacing:0.3em;color:${C.gold}">BOOKSHOP</span>
      </div>
      <span style="font-size:8px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#767684">${esc(s.printLabelTitle)}</span>
    </div>
    <div style="background:${C.primary};border-radius:2.5mm;padding:2.6mm 4mm;margin-top:3mm;display:flex;justify-content:space-between;align-items:center">
      <span style="color:#fff;font-size:8px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">${esc(s.receiptOrderNumber)}</span>
      <span style="color:#fff;font-family:'Courier New',monospace;font-weight:800;font-size:13px;letter-spacing:0.04em">${esc(order.orderNumber)}</span>
    </div>
    <div style="display:flex;height:${148 - 60}mm;margin-top:3mm">
      <div style="flex:1.35;border:0.5mm solid #d8d8e0;border-radius:2.5mm;padding:4mm;display:flex;flex-direction:column">
        <div style="font-size:7.5px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:${C.gold}">${esc(s.printLabelReceiver)}</div>
        <div style="margin-top:2mm;font-family:Georgia,serif;font-weight:800;font-size:14px">${esc(order.customerName)}</div>
        <div dir="ltr" style="margin-top:1mm;font-weight:700;font-size:12px">${esc(order.phone)}</div>
        <div style="margin-top:3mm;font-size:10px;line-height:1.6;color:#33333f">
          ${address}
        </div>
        <div style="margin-top:auto;background:${C.primarySoft};border-radius:2mm;padding:2.4mm 3mm;font-size:10.5px;font-weight:800;color:${C.primary}">${esc(wil || "—")}</div>
      </div>
      <div style="width:4mm"></div>
      <div style="flex:1;border:0.5mm solid #d8d8e0;border-radius:2.5mm;padding:4mm;display:flex;flex-direction:column">
        <div style="font-size:7.5px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#767684">${esc(s.printLabelSender)}</div>
        <div style="margin-top:2.5mm;font-family:Georgia,serif;font-weight:800;font-size:13px">${esc(s.brand)}</div>
        <div dir="ltr" style="font-weight:700;font-size:10.5px">${esc(SITE.phone)}</div>
        <div style="margin-top:auto;border:0.6mm dashed ${C.gold};border-radius:2mm;padding:3mm;text-align:center">
          <div style="font-size:7.5px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#767684">${esc(s.printLabelAmount)}</div>
          <div style="font-family:Georgia,serif;font-weight:800;font-size:24px;color:${C.primary};margin-top:1.5mm">${fmt(order.total)}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:3mm;border:0.4mm solid #d8d8e0;border-radius:2mm;padding:2.5mm 3.5mm;display:flex;justify-content:space-between;align-items:center;font-size:9px">
      <span style="font-weight:800;color:${C.primary}">${esc(s.printLabelItems)} (${order.items.reduce((n, i) => n + i.quantity, 0)}):</span>
      <span style="color:#57575f">${esc(order.items.map((i) => `${i.title} ×${i.quantity}`).join(" · "))}</span>
    </div>
    ${order.giftCard ? `<div style="margin-top:2.5mm;background:${C.gold}14;border:0.5mm solid ${C.gold};color:#7a5d10;border-radius:2mm;padding:2mm 3.5mm;font-size:9px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase">🎁 ${esc(s.printLabelGift)}</div>` : ""}
  </div>`;
  doc(moldHtml(148, 105, body));
}

export function printGiftCard(order: PrintOrder, s: PrintStrings, locale: string) {
  const body = `
  <div class="wrap" dir="${locale === "ar" ? "rtl" : "ltr"}" style="position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <div style="position:absolute;inset:5mm;border:0.8mm double ${C.gold};border-radius:4mm"></div>
    <div style="position:absolute;inset:7mm;border:0.3mm solid ${C.primary}30;border-radius:3mm"></div>
    <div style="font-family:Georgia,serif;font-weight:800;font-size:26px;letter-spacing:0.04em;color:${C.primary}">BORDERS</div>
    <div style="margin-top:1.6mm;font-size:8px;font-weight:800;letter-spacing:0.4em;text-transform:uppercase;color:${C.gold}">${esc(s.printGiftTitle)}</div>
    <div style="margin:7mm 0 0;width:26mm;height:0.6mm;background:${C.gold}"></div>
    <div style="margin-top:7mm;font-family:Georgia,serif;font-style:italic;font-size:13.5px;line-height:1.85;color:#26262f;padding:0 10mm">${esc(order.giftMessage ?? "-")}</div>
    <div style="margin-top:auto;padding-bottom:6mm;display:flex;flex-direction:column;gap:1.4mm;font-size:8.5px;color:#767684">
      <div><span style="font-weight:800;color:#3d3d4a">${esc(s.printGiftTo)}:</span> ${esc(order.customerName)} · <span dir="ltr">${esc(order.phone)}</span></div>
      <div><span style="font-family:'Courier New',monospace;font-weight:800;color:${C.primary}">${esc(order.orderNumber)}</span></div>
      <div style="letter-spacing:0.24em;text-transform:uppercase">${esc(s.brand)} · ${esc(s.brandSub)}</div>
    </div>
  </div>`;
  doc(moldHtml(148, 105, body));
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
