import re

with open('src/components/SalarySlip.tsx', 'r') as f:
    content = f.read()

content = content.replace("scheduledTime: scheduleDate\n        })", "scheduledTime: scheduleDate,\n          fonnteToken: settings.fonnteToken\n        })")
content = content.replace("scheduledTime: scheduleDate\n          })", "scheduledTime: scheduleDate,\n            fonnteToken: settings.fonnteToken\n          })")

with open('src/components/SalarySlip.tsx', 'w') as f:
    f.write(content)
