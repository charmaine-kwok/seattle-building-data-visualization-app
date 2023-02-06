# Varadise Web Developer Exercise

## Basic requirements ( 16/08/21 ) Revised ( 06/02/23 )

### Frontend:

Configure a project folder for SPA development, where 
package.json should list all the libraries (especially those for data visualization) used
several component files (with specific property or method definitions) define the layout/structure/design of pages (how would you divide the components of a webpage)
middleware and helper functions that facilitate communication with backend (eg API caller, date formatter..)
Under above project structure, implement layout of the overview page
by React

### Backend:

Given the visualization requirement and data structure, draft an API document to instruct frontend on the request/response spec
by Golang

---

## Bonus requirements


- Fetch requested data via API 

- Create visualization of the given data

- Deliverables include source code and the stable build of a functional fullstack application, with optional text files to describe the work 

- Work will be reviewed by the succinctness of the code, stability, modularity, performance and user experience of the web app


## Backend requirements

- Use `SQLite` or familiar DB as datasource to fetch data 

- Implement API using Golang for frontend's requests

### Authentication 

- Provide API for frontend to authenticate user from username and password. Use `admin` as username and `password` as password in this exercise.

- Returns error message if the login attempt fails

### API 

- Create an API to get average EUI (**round to 3 decimals**) ( `"metrics"."metric"` / `"buildings_gfa"."PropertyUseTypeGFA"` ) grouped by `"PrimaryPropertyType"` in avaerage

- Query the table of following SQL or equivalent:

``` sql
SELECT 
  type, 
  avg(eui) AS `average_eui` 
FROM 
  (
    SELECT 
      `t`.`OSEBuildingID` AS `id`, 
      `t`.`PrimaryPropertyType` AS `type`, 
      `t2`.`electricity` / `t1`.`gfa` AS `eui` 
    FROM 
      `buildings` t 
      LEFT JOIN (
        SELECT 
          `OSEBuildingID` AS `id`, 
          SUM(`PropertyUseTypeGFA`) AS `gfa` 
        FROM 
          `buildings_gfa` 
        GROUP BY
          `OSEBuildingID`
      ) t1 ON `t`.`OSEBuildingID` = `t1`.`id` 
      LEFT JOIN (
        SELECT 
          `OSEBuildingID` AS id, 
          value AS `electricity` 
        FROM 
          metrics 
        WHERE 
          metric = 'Electricity'
      ) t2 ON `t`.`OSEBuildingID` = `t2`.`id`
  ) 
GROUP BY
  `type`
```

- Create another API to get the list of building informations from `buildings` ORM, which accepts parameters to support returning partial data rows

## Frontend requirements

- **Feel free to use any third party libraries** (Especially for UI components, data visualization) in achieving the task with proper justification

### User Interface

- The application consists of 3 pages: `Login`, `Overview` and `Chart`

- (Optional) Unauthenticated users cannot visit `Overview` and `Chart`, authenticated users will be redirected to `Overview` if they visit `Login`

- `Login` page allows user to sign in using the credentials specified in backend. Users are allowed to sign out once they are authenticated

- `Overview` page allows user to browse list of `buildings` data fetched from API and support any forms of paging. (see [Data Visualization])

- `Chart` page displays a bar chart showing the `average_eui` by `PrimaryPropertyType` (see [Data Visualization])

-  Use `flexbox` or `grid` to construct main layout / component of the web app with minimal responsive design

-  Use moderate transition to enhance user experience

-  Loading indicator when fetching data 

-  Layout, style and interactive design are open to interpretation


###  Data Visualization

- Plot a bar chart showing the `average_eui` by `PrimaryPropertyType`

- Represent the data in `buildings` table in list view, when user clicks the item, a detail view of the item is shown

- The representation of the data is open to interpretation in an informative and user-friendly manner.


###  Dockerize Your Job (Optional)
- Please include your dockerfile with your source so we can build the docker image directly from the git folder
- Make a script for building your docker
- Mkae a script for running your docker in a linux environment
- Upload your docker image to public image repo and provide the link
- (Or) Deploy to any k8s which is accessible and submit your yaml files. 

### Example layout

[Excalidraw](https://excalidraw.com/#json=4852274673221632,a1urShHV547sm_foOMNpKg)

### Submission
- Fork to your account for your works and share with our review commitee (frederic_var, KenKam_Varadise, dollkwong, michael.tse1, wickeswong, vinsonwong)

