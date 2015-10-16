
Deployments
===========

<table class="ui compact single line table" component:id="deployments-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Base URL</th>
      <th>Type</th>
      <th>Platform</th>
    </tr>
  </thead>
  <tbody component:section="deployment">
    <tr component:section="deployment" component:view="deployment">
      <td component:prop="name"></td>
      <td><a href="{{baseUrl}}" component:prop="baseUrl"></a></td>
      <td component:prop="type"></td>
      <td component:prop="platform"></td>
    </tr>
    <tr component:section="deployment" component:view="stacks">
      <td colspan="4">
      
        <table class="ui compact single line selectable table">
          <thead>
            <tr>
              <th>Stack</th>
              <th>Namespace</th>
              <th>Sub URI</th>
            </tr>
          </thead>
          <tbody component:section="stack">
            <tr component:section="stack" component:view="stack" data-component-action="open-stack" data-id="{{id}}">
              <td component:prop="label"></td>
              <td component:prop="namespace"></td>
              <td component:prop="subUri"></td>
            </tr>
          </tbody>
        </table>

      </td>
    </tr>
  </tbody>
</table>


Developers
==========

<table class="ui compact single line table" component:id="developers-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Responsibility</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody component:section="row">
    <tr component:section="row" component:view="default">
      <td component:prop="name"></td>
      <td component:prop="responsibility"></td>
      <td><a href="mailto:{{email}}" component:prop="email">christoph@christophdorn.com</a></td>
    </tr>
  </tbody>
</table>



<script component:id="deployments-table" component:location="window">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
			"#chscript:redraw": {
          mapData: function (data) {
              return {
                  "@load": [
                      "deployments"
                  ],
                  "@map": {
                    'deployments': data.connect('pinf.genesis.model.DeploymentPointer/*', function (data) {
                      return {
                        "id": data.connect("id"),
                        "name": data.connect("name"),
                        "baseUrl": data.connect("baseUrl")
                      };
                    }),
                    'deployment-details': data.connect('pinf.genesis.model.Deployment/*', function (data) {
                      return {
                        "id": data.connect("id"),
                        "baseUrl": data.connect("baseUrl"),
                        "inviteInfo": data.connect("inviteInfo")
                      };
                    }),
                    'stacks': data.connect('pinf.genesis.model.Stack/*', function (data) {
                      return {
                        "id": data.connect("id"),
                        "label": data.connect("label"),
                        "namespace": data.connect("namespace"),
                        "subUri": data.connect("subUri"),
                        "invitePage": data.connect("invitePage")
                      };
                    })
                  },
                  "@postprocess": function (data) {
                      data.deployments.forEach(function (deployment) {
                          // TODO: Do this dynamically once remote data loads as well.
                          if (deployment.get("id") === "127.0.0.1:8090") {
                              deployment.stack = data.stacks;
                          }
                      });
                      return data;
                  }
              };
          },
          getTemplateData: function (data) {
              return {
                  "deployment-details": data["deployment-details"],
                  "stacks": data["stacks"],
                  "deployment": data.deployments.map(function (row) {
                      row["$views"] = {};
                      row["$views"]['deployment'] = true;
      
                      // TODO: Instead of hardcoding, enable view if data is available.
                      if (row.get("id") === "127.0.0.1:8090") {
                          row["$views"]['stacks'] = true;
                          row["stack"].forEach(function (stack) {
                              stack["$views"] = {};
                              stack["$views"]['stack'] = true;
                          });
                      }
                      return row;
                  })
              };
          },
          afterRender: function (domNode, data) {
              var helpers = this;
              domNode.click(function (event) {
                  var node = helpers.findActionableNode(event.target);
                  if (
                      node &&
                      node.action === "open-stack"
                  ) {
      
                      // HACK: Do this dynamically
                      var inviteInfo = data["deployment-details"][0].get("inviteInfo");
                      var baseUrl = data["deployment-details"][0].get("baseUrl");
                      var stack = data["stacks"].filter(function (stack) {
                          return (stack.get("id") === node.id);
                      }).pop();
      
                      var url =
                          baseUrl +
                          stack.get("subUri") +
                          (stack.get("invitePage") || "") + 
                          "?" + inviteInfo.name + "=" + inviteInfo.value;
      
                      window.open(url, "_blank");
                  }
              });
          }
			}
		};
	}, globalContext);
}
</script>

<script component:id="deployments-table" component:location="server">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
		    "#0.FireWidgets": {
		        getDataForPointer: function (pointer) {
              const aspects = globalContext.adapters["model.pinf.genesis"];
      
              if (pointer === "deployments") {
                  return {
                      "pinf.genesis.model.DeploymentPointer": aspects.getCollectionRecords("DeploymentPointer"),
                      "pinf.genesis.model.Deployment": aspects.getCollectionRecords("Deployment"),
                      "pinf.genesis.model.Stack": aspects.getCollectionRecords("Stack")
                  };
              }
		        }
		    }
		};
	}, globalContext);
}
</script>


<script component:id="stacks-table" component:location="window">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
			"#chscript:redraw": {
        mapData: function (data) {
            return {
                "@load": [
                    "stacks"
                ],
                "@map": {
                  'rows': data.connect('pinf.genesis.model.Stack/*', function (data) {
                    return {
                      "id": data.connect("id"),
                      "label": data.connect("label"),
                      "namespace": data.connect("namespace"),
                      "subUri": data.connect("subUri")
                    };
                  })
                }
            };
        },
        getTemplateData: function (data) {
            return {
                "row": data.rows.map(function (row) {
                    row["$views"] = {};
                    row["$views"]['default'] = true;
                    return row;
                })
            };
        }
			}
		};
	}, globalContext);
}
</script>

<script component:id="stacks-table" component:location="server">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
		    "#0.FireWidgets": {
		        getDataForPointer: function (pointer) {
              const aspects = globalContext.adapters["model.pinf.genesis"];
      
              if (pointer === "stacks") {
                  return {
                      "pinf.genesis.model.Stack": aspects.getCollectionRecords("Stack")
                  };
              }
		        }
		    }
		};
	}, globalContext);
}
</script>



<script component:id="developers-table" component:location="window">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
			"#chscript:redraw": {
        mapData: function (data) {
            return {
                "@load": [
                    "developers"
                ],
                "@map": {
                  'rows': data.connect('pinf.genesis.model.Developer/*', function (data) {
                    return {
                      "id": data.connect("id"),
                      "name": data.connect("name"),
                      "email": data.connect("email"),
                      "responsibility": data.connect("responsibility", {
                        format: function (value) {
                          if (!Array.isArray(value)) {
                            return value;
                          }
                          return value.join(", ");
                        }
                      })
                    };
                  })
                }
            };
        },
        getTemplateData: function (data) {
            return {
                "row": data.rows.map(function (row) {
                    row["$views"] = {};
                    row["$views"]['default'] = true;
                    return row;
                })
            };
        }
			}
		};
	}, globalContext);
}
</script>

<script component:id="developers-table" component:location="server">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
		    "#0.FireWidgets": {
		        getDataForPointer: function (pointer) {
              const aspects = globalContext.adapters["model.pinf.genesis"];
      
              if (pointer === "developers") {
                  return {
                      "pinf.genesis.model.Developer": aspects.getCollectionRecords("Developer")
                  };
              }
		        }
		    }
		};
	}, globalContext);
}
</script>
