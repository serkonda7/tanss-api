# Changelog
## 0.4.0
_2026-10-05_

- update to TANSS API 10.18.0
- new endpoints:
  - `postApiErpV1Invoices`
  - `postApiErpV1TicketsTicketIdComments`
  - `postApiDeviceManagementV1Documents`, `postApiDeviceManagementV1DocumentsIdFile`
  - `postApiV1EmployeesDepartments`
  - `deleteApiV1SupportsSupportId`
  - `getApiV1Cars`

### Migration notes
The following generated SDK functions were removed or replaced:

| Removed | Replacement |
| --- | --- |
| `getApiV1OfferOfferId`, `putApiV1OfferOfferId`, `deleteApiV1OfferOfferId` | `getApiV1OffersOfferId`, `putApiV1OffersOfferId`, `deleteApiV1OffersOfferId` |
| `getApiV1OffersPdfOfferId` | `getApiV1OffersPdfOfferIdWorkflowId` |
| `putApiV1TicketBoardPanel` | `putApiV1TicketBoardPanelId` (panel id moved into the path) |
| `getApiV1TicketBoardProjectGlobalPanels` | `getApiV1TicketBoardGlobalPanels` |
| `postApiV1VacationRequestsVacationDays` | `putApiV1VacationRequestsVacationDays` |
| `getApiV1SearchApiV1Search{Devices,Employees,Knowledgebase,Mailaccounts,Supports,Tickets}` | `putApiV1Search` (global search) |
| `postApiV1Cars`, `putApiV1CarsId`, `deleteApiV1CarsId` | — (read-only: `getApiV1Cars`, `getApiV1CarsId`) |
| `getApiV1ChecklistEventsId` | — |
| `getApiV1EmployeesApiV1EmployeesFreelancersCompanyId` | — |
| `getApiV1TasksSeries`, `postApiV1TasksSeries` | — (`postApiV1TasksSeriesNext` remains) |
| `getApiV1TemplatesSupportProfileConvertId` | — |
| `getApiV1TimelineOutlookSync` | — |
| `getApiV1VouchersId`, `postApiV1VouchersId` | — |

The `erp` abstraction layer is unaffected.


## 0.3.0
_2026-09-29_

- split `erp.customers.list()` into `erp.customers.listAll()` and `erp.customers.listModified(timestamp)`
- simple docs generator


## 0.2.1
_2026-09-18_

- Re-release of 0.2.0 with fixed npm publishing


## 0.2.0
_2026-09-15_

- erp: improve route abstractions
- dependency updates


## 0.1.0
_2026-07-23_

- Initial release
