import re

with open('src/components/SlipDocument.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { SalarySlip } from '../types';", "import { SalarySlip, AppSettings } from '../types';")
content = content.replace("interface SlipDocumentProps {\n  slip: SalarySlip;\n}", "interface SlipDocumentProps {\n  slip: SalarySlip;\n  settings: AppSettings;\n}")
content = content.replace("export const SlipDocument = forwardRef<HTMLDivElement, SlipDocumentProps>(({ slip }, ref) => {", "export const SlipDocument = forwardRef<HTMLDivElement, SlipDocumentProps>(({ slip, settings }, ref) => {")

content = content.replace("<h2 className=\"text-2xl font-black tracking-wide text-black\">MI AL-BAROKAH</h2>", "<h2 className=\"text-2xl font-black tracking-wide text-black\">{settings.schoolName.toUpperCase()}</h2>\n        <p className=\"text-sm font-semibold\">Tahun Ajaran {settings.academicYear}</p>")

content = content.replace("<div>Dibuat Oleh,</div>", "<div>{settings.signatoryRole}</div>")
content = content.replace("<div className=\"font-bold w-48 border-b border-black text-center mx-auto\"></div>", f"<div className=\"font-bold text-center mx-auto whitespace-nowrap\"><u>{{settings.signatoryName}}</u></div>\n        {{settings.signatoryNip && <div className=\"text-center mt-1 text-xs\">NIP: {{settings.signatoryNip}}</div>}}")

with open('src/components/SlipDocument.tsx', 'w') as f:
    f.write(content)
