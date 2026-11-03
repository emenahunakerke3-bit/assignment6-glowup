$(document).ready(function () {

  const $userNameInput =$('#userNameInput');
  const $greetBtn =$('#greetBtn');
  const $welcomeMessage =$('#welcomeMessage');
  const $themeToggleBtn =$('#themeToggleBtn');
  const $body =$('body');

  $greetBtn.on('click', function () {
    const enteredName = $userNameInput.val().trim();

    if (enteredName === '') {
      $welcomeMessage
        .text('Please enter your name so we can personalize your experience.')
        .removeClass('success-state')
        .addClass('error-state');
    } else {
      $welcomeMessage
        .text(`Welcome to GlowUp Studio, ${enteredName}! Your self-care journey begins today.`)
        .removeClass('error-state')
        .addClass('success-state');
    }
  });

  $userNameInput.on('input', function () {
    if ($(this).val().trim() !== '') {$welcomeMessage.text('');
    }
  });

  $themeToggleBtn.on('click', function () {$body.toggleClass('dark-theme');
    const isDark = $body.hasClass('dark-theme');

    $(this).text(isDark ? 'Switch to Sunny Glow' : 'Switch to Cozy Night');
  });

  const $accordionBtns =$('.accordion-btn');

  $accordionBtns.on('click', function () {
    const $thisBtn =$(this);
    const $targetPanel =$thisBtn.next('.accordion-panel');

    $('.accordion-btn').not($thisBtn).attr('aria-expanded', 'false');
    $('.accordion-panel').not($targetPanel).stop(true, true).slideUp(250);
    $('.accordion-btn').not($thisBtn).find('.accordion-icon').text('+');

    $targetPanel.stop(true, true).slideToggle(250, function () {
      const currentlyVisible = $(this).is(':visible');
      $thisBtn.attr('aria-expanded', currentlyVisible);$thisBtn.find('.accordion-icon').text(currentlyVisible ? '−' : '+');
    });
  });

  const $faqStatusNotice =$('#faqStatusNotice');
  $('#toggleNoticeBtn').on('click', function () {
    if ($faqStatusNotice.is(':visible')) {
      $faqStatusNotice.stop(true, true).fadeOut(300);$(this).text('Show Studio Notice');
    } else {
      $faqStatusNotice.stop(true, true).fadeIn(300);$(this).text('Hide Studio Notice');
    }
  });

  const $searchInput =$('#searchInput');
  const $categoryBtns =$('.category-btn');
  const $ritualCards =$('.ritual-card');
  const $noResultsMsg =$('#noResultsMsg');
  const $matchCounter =$('#matchCounter');

  let activeCategory = 'all';

  function applyCombinedFilters() {
    const query = $searchInput.val().trim().toLowerCase();
    let visibleCount = 0;

    $ritualCards.each(function () {
      const $card =$(this);
      const cardCategory = $card.data('category');
      const cardText = $card.text().toLowerCase();

      const matchesSearch = query === '' || cardText.indexOf(query) !== -1;
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

      if (matchesSearch && matchesCategory) {
        $card.show();
        visibleCount++;
      } else {
        $card.hide();
      }
    });

    if (visibleCount === 0) {
      $noResultsMsg.show();$matchCounter.text('No matching rituals found');
    } else {
      $noResultsMsg.hide();$matchCounter.text(`Showing ${visibleCount} of ${$ritualCards.length} rituals`);
    }
  }

  $searchInput.on('input', applyCombinedFilters);

  $categoryBtns.on('click', function () {
    $categoryBtns.removeClass('active');$(this).addClass('active');

    activeCategory = $(this).data('category');
    applyCombinedFilters();
  });

  const $routineForm =$('#routineForm');
  const $routineInput =$('#routineInput');
  const $routineList =$('#routineList');
  const $routineCount =$('#routineCount');
  const $emptyPlannerMsg =$('#emptyPlannerMsg');

  function updateRoutineCounter() {
    const currentTotal = $routineList.children('li').length;
    $routineCount.text(currentTotal);

    if (currentTotal === 0) {
      $emptyPlannerMsg.show();
    } else {
      $emptyPlannerMsg.hide();
    }
  }

  $routineForm.on('submit', function (e) {
    e.preventDefault();
    const itemText = $routineInput.val().trim();

    if (itemText === '') {
      $routineInput.focus();
      return;
    }

    const $newLi =$('<li>').addClass('routine-item');
    const $itemSpan =$('<span>').addClass('item-name').text(itemText);
    const $deleteBtn =$('<button>')
      .attr('type', 'button')
      .addClass('btn btn-danger-sm btn-remove-item')
      .text('Remove');

    $newLi.append($itemSpan,$deleteBtn);
    $routineList.append($newLi);

    $routineInput.val('').focus();
    updateRoutineCounter();
  });

  $routineList.on('click', '.btn-remove-item', function () {$(this).closest('li').remove();
    updateRoutineCounter();
  });

  updateRoutineCounter();

  const $enquiryForm =$('#enquiryForm');
  const $formSuccessNotice =$('#formSuccessNotice');
  const $successSummary =$('#successSummary');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  $enquiryForm.on('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    $('.error-msg').text('');$('.glow-input').removeClass('input-error');

    const clientName = $('#clientName').val().trim();
    if (clientName === '') {
      $('#nameError').text('Full name is required.');
      $('#clientName').addClass('input-error');
      isValid = false;
    }

    const clientEmail = $('#clientEmail').val().trim();
    if (clientEmail === '') {
      $('#emailError').text('Email address is required.');
      $('#clientEmail').addClass('input-error');
      isValid = false;
    } else if (!emailRegex.test(clientEmail)) {
      $('#emailError').text('Please enter a valid email (e.g. name@example.com).');
      $('#clientEmail').addClass('input-error');
      isValid = false;
    }

    const serviceType = $('#serviceType').val();
    if (serviceType === '') {
      $('#serviceError').text('Please select an inquiry type.');
      $('#serviceType').addClass('input-error');
      isValid = false;
    }

    const clientMessage = $('#clientMessage').val().trim();
    if (clientMessage === '') {
      $('#messageError').text('Please provide message details.');
      $('#clientMessage').addClass('input-error');
      isValid = false;
    } else if (clientMessage.length < 10) {
      $('#messageError').text('Message must contain at least 10 characters.');
      $('#clientMessage').addClass('input-error');
      isValid = false;
    }

    if (isValid) {
      $enquiryForm.slideUp(300);$successSummary.text(
        `Thank you, ${clientName}! We recorded your inquiry regarding "${$('#serviceType option:selected').text()}". A response will be sent to ${clientEmail}.`
      );
      $formSuccessNotice.fadeIn(400);
    }
  });

});