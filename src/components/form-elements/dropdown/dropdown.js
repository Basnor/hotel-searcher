import 'item-quantity-dropdown/lib/item-quantity-dropdown.min';
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.css';

/* global jQuery */
/* eslint-disable func-names */
(function ($) {
  const defaults = {
    maxItems: Infinity,
    minItems: 0,
    selectionText: 'item',
    textPlural: 'items',
    controls: {
      position: 'right',
      displayCls: 'iqdropdown-content',
      controlsCls: 'iqdropdown-item-controls',
      counterCls: 'counter',
    },
    items: {},
    onChange: () => {},
    beforeDecrement: () => true,
    beforeIncrement: () => true,
    setSelectionText (itemCount, totalItems) {
      const usePlural = totalItems !== 1 && this.textPlural.length > 0;
      const text = usePlural ? this.textPlural : this.selectionText;
      return `${totalItems} ${text}`;
    },
  };

  $.fn.iqDropdown = function (options) {
    this.each(function () {
      const $this = $(this);
      const $selection = $this.find('p.iqdropdown-selection').last();
      const $menu = $this.find('div.iqdropdown-menu');
      const $items = $menu.find('div.iqdropdown-menu-option');
      const dataAttrOptions = {
        selectionText: $selection.data('selection-text'),
        textPlural: $selection.data('text-plural'),
      };
      const settings = $.extend(true, {}, defaults, dataAttrOptions, options);
      const itemCount = {};
      let totalItems = 0;

      function updateDisplay () {
        if (totalItems == 0) {
          $('.iqdropdown-menu-clean').hide();
        } else {
          $('.iqdropdown-menu-clean').show();
        }


        $selection.html(settings.setSelectionText(itemCount, totalItems));
      }

      function setItemSettings (id, $item) {
        const minCount = Number($item.data('mincount'));
        const maxCount = Number($item.data('maxcount'));

        settings.items[id] = {
          minCount: Number.isNaN(Number(minCount)) ? 0 : minCount,
          maxCount: Number.isNaN(Number(maxCount)) ? Infinity : maxCount,
        };
      }

      function addControls (id, $item) {
        const $controls = $('<div />').addClass(settings.controls.controlsCls);
        const $decrementButton = $(`
          <button class="button-decrement">
            <i class="icon-decrement"></i>
          </button>
        `);
        const $incrementButton = $(`
          <button class="button-increment">
            <i class="icon-decrement icon-increment"></i>
          </button>
        `);
        const $counter = $(`<span>${itemCount[id]}</span>`).addClass(settings.controls.counterCls);

        $item.children('div').addClass(settings.controls.displayCls);
        $controls.append($decrementButton, $counter, $incrementButton);

        if (settings.controls.position === 'right') {
          $item.append($controls);
        } else {
          $item.prepend($controls);
        }

        $('.iqdropdown-menu-clean').click(function(){
          totalItems = 0;
          itemCount[id] = 0;
          $counter.html(itemCount[id]);
          updateDisplay();
        });

        $decrementButton.fadeTo(0, 0.33);

        $decrementButton.click((event) => {
          const { items, minItems, beforeDecrement, onChange } = settings;
          const allowClick = beforeDecrement(id, itemCount);

          if (allowClick && totalItems > minItems && itemCount[id] > items[id].minCount) {
            itemCount[id] -= 1;
            totalItems -= 1;
            $counter.html(itemCount[id]);
            updateDisplay();
            onChange(id, itemCount[id], totalItems);
          } 

          if (itemCount[id] == items[id].minCount){
            $decrementButton.fadeTo(0, 0.33);
            updateDisplay();
          }

          event.preventDefault();
        });

        $incrementButton.click((event) => {
          const { items, maxItems, beforeIncrement, onChange } = settings;
          const allowClick = beforeIncrement(id, itemCount);

          if (allowClick && totalItems < maxItems && itemCount[id] < items[id].maxCount) {
            $decrementButton.fadeTo(0, 1.0);

            itemCount[id] += 1;
            totalItems += 1;
            $counter.html(itemCount[id]);
            updateDisplay();
            onChange(id, itemCount[id], totalItems);
          }

          event.preventDefault();
        });

        $item.click(event => event.stopPropagation());

        return $item;
      }

      $this.click(() => {
        $this.toggleClass('menu-open');
      });

      $items.each(function () {
        const $item = $(this);
        const id = $item.data('id');
        const defaultCount = Number($item.data('defaultcount') || '0');

        itemCount[id] = defaultCount;
        totalItems += defaultCount;
        setItemSettings(id, $item);
        addControls(id, $item);
      });

      updateDisplay();
    });

    return this;
  };
}(jQuery));



$(document).ready(function() {
    $(".no-config").iqDropdown();

    $(".custom").iqDropdown({
      minItems: 0,
      maxItems: Infinity,
      selectionText: "гость",
      textPlural: "Сколько гостей",
      onChange: function(id, count, totalItems) {
        console.log(id, count, totalItems);
      },
      setSelectionText: function (itemCount, totalItems) {
        var mean = "";
        if (totalItems < 1) {
          mean = "Сколько гостей";
        }
        if (totalItems == 1) {
          mean = totalItems + " " + "гость";
        }
        if (totalItems > 1 && totalItems <= 4) {
          mean = totalItems + " " + "гостя";
        }
        if (totalItems > 4) {
          mean = totalItems + " " + "гостей";
        }
        return mean;
      }
    });

    $(".custom-message").iqDropdown({
      minItems: 0,
      onChange: function(id, count, totalItems) {
        console.log(id, count, totalItems);
      },
      setSelectionText: function (itemCount, totalItems) {
        const items = Object.keys(itemCount)
          .map(key => itemCount[key])
          .join(' + ');
        return items + ' = ' + totalItems;
      }
    });

  });
  
