with open("src/components/SalarySlip.tsx", "r") as f:
    c = f.read()

# Add host to schedule
c = c.replace("fonnteToken: settings.fonnteToken\n        })", "fonnteToken: settings.fonnteToken,\n          host: window.location.origin\n        })")
c = c.replace("fonnteToken: settings.fonnteToken\n          })", "fonnteToken: settings.fonnteToken,\n            host: window.location.origin\n          })")

with open("src/components/SalarySlip.tsx", "w") as f:
    f.write(c)
