window.findKeyframesRule = (rule) ->
  # gather all stylesheets into an array
  ss = document.styleSheets
  # loop through the stylesheets
  i = 0
  while i < ss.length
    # loop through all the rules
    j = 0
    while j < ss[i].cssRules.length
      type = ss[i].cssRules[j].type
      typeWebkit = type is window.CSSRule.WEBKIT_KEYFRAMES_RULE
      typeNormal = type is window.CSSRule.KEYFRAMES_RULE
      nameFits = ss[i].cssRules[j].name is rule
      if (typeWebkit or typeNormal) and nameFits
        return ss[i].cssRules[j]
      ++j
    ++i
  # rule not found
  null