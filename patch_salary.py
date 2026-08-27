import re

with open('src/components/SalarySlip.tsx', 'r') as f:
    content = f.read()

# Update import
content = content.replace("import { Teacher, SalarySlip } from '../types';", "import { Teacher, SalarySlip, AppSettings } from '../types';")

# Update props
content = content.replace("  setSlips: React.Dispatch<React.SetStateAction<SalarySlip[]>>;\n}", "  setSlips: React.Dispatch<React.SetStateAction<SalarySlip[]>>;\n  settings: AppSettings;\n}")
content = content.replace("export function SalarySlipManager({ teachers, slips, setSlips }: SalarySlipProps) {", "export function SalarySlipManager({ teachers, slips, setSlips, settings }: SalarySlipProps) {\n  const generateMessage = (name: string, month: string, year: number) => {\n    return settings.waTemplate.replace('[NAMA]', name).replace('[BULAN]', month).replace('[TAHUN]', year.toString());\n  };")

# Replace hardcoded messages
content = content.replace("text: `Assalamualaikum Wr. Wb. Yth. ${teacher.name},\\n\\nBerikut terlampir Slip Gaji Anda untuk bulan ${viewingSlip.month} ${viewingSlip.year}.\\n\\nTerima kasih.`,", "text: generateMessage(teacher.name, viewingSlip.month, viewingSlip.year),")
content = content.replace("caption: `Assalamualaikum Wr. Wb. Yth. ${teacher.name},\\n\\nBerikut terlampir Slip Gaji Anda untuk bulan ${viewingSlip.month} ${viewingSlip.year}.\\n\\nTerima kasih.`,", "caption: generateMessage(teacher.name, viewingSlip.month, viewingSlip.year),")
content = content.replace("caption: `Assalamualaikum Wr. Wb. Yth. ${teacher.name},\\n\\nBerikut terlampir Slip Gaji Anda untuk bulan ${slip.month} ${slip.year}.\\n\\nTerima kasih.`,", "caption: generateMessage(teacher.name, slip.month, slip.year),")

# Pass settings to SlipDocument
content = content.replace("<SlipDocument slip={viewingSlip} ref={slipRef} />", "<SlipDocument slip={viewingSlip} ref={slipRef} settings={settings} />")
content = content.replace("<SlipDocument slip={slip} />", "<SlipDocument slip={slip} settings={settings} />")

with open('src/components/SalarySlip.tsx', 'w') as f:
    f.write(content)
